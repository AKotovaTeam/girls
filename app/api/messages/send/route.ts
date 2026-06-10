import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getCurrentAccount } from '@/lib/auth'
import { getTenantFromHost } from '@/lib/tenant'
import { getOrCreateConversation, getConversationMessages } from '@/lib/messages'
import { deductMessageAndSend } from '@/lib/message-deduction'
import { generateCreatorResponse } from '@/lib/llm'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { attachPhotosToMessage, saveMessageImages } from '@/lib/attach-photos'

export async function POST(request: Request) {
  try {
    const host = (await headers()).get('host') || ''
    const creator = await getTenantFromHost(host)
    
    if (!creator) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      )
    }
    
    const account = await getCurrentAccount()
    
    if (!account) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    if (account.creator_id !== creator.id) {
      return NextResponse.json(
        { error: 'Invalid account' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const { message, conversationId } = body
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }
    
    // Get or create conversation (with welcome message for new conversations)
    const conversation = await getOrCreateConversation(
      creator.id,
      account.id,
      creator.display_name || creator.slug,
      creator.primary_domain,
      creator.included_message_limit
    )
    
    if (conversationId && conversation.id !== conversationId) {
      return NextResponse.json(
        { error: 'Invalid conversation' },
        { status: 400 }
      )
    }
    
    // Deduct credit and send user message
    const deductionResult = await deductMessageAndSend(
      account.id,
      creator.id,
      conversation.id,
      message.trim(),
      creator.included_message_limit
    )
    
    if (!deductionResult.success) {
      if (deductionResult.error === 'NO_CREDITS') {
        return NextResponse.json(
          { error: 'NO_CREDITS', creditsRemaining: 0 },
          { status: 402 } // Payment Required
        )
      }
      
      return NextResponse.json(
        { error: deductionResult.error || 'Failed to send message' },
        { status: 500 }
      )
    }
    
    // Get conversation history for LLM
    const history = await getConversationMessages(conversation.id)
    const conversationHistory = history.map(msg => ({
      role: msg.sender_account_id === account.id ? 'user' as const : 'assistant' as const,
      content: msg.body,
    }))
    
    // Generate creator response using LLM
    const llmResponse = await generateCreatorResponse(
      message.trim(),
      conversationHistory,
      creator.display_name || 'Jane'
    )
    
    // Get or create a creator account for sending messages
    // For MVP, we'll create a special account for the creator
    const supabase = getSupabaseServiceRole()
    
    // Try to find existing creator account (e.g., creator@domain.com)
    const creatorEmail = `creator@${creator.primary_domain.split(':')[0]}`
    const { data: creatorAccounts } = await supabase
      .from('accounts')
      .select('id')
      .eq('creator_id', creator.id)
      .eq('email', creatorEmail)
      .limit(1)
    
    let creatorAccountId: string | null = null
    
    if (creatorAccounts && creatorAccounts.length > 0) {
      creatorAccountId = creatorAccounts[0].id
    } else {
      // Create creator account for auto-responses
      const { data: newCreatorAccount, error: createError } = await supabase
        .from('accounts')
        .insert({
          creator_id: creator.id,
          email: creatorEmail,
        })
        .select()
        .single()
      
      if (!createError && newCreatorAccount) {
        creatorAccountId = newCreatorAccount.id
      }
    }
    
    // Save creator response if we have an account (no deduction for creator messages)
    let creatorMessageId = null
    if (creatorAccountId) {
      const { data: creatorMessage } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_account_id: creatorAccountId,
          body: llmResponse.message,
        })
        .select()
        .single()
      
      if (creatorMessage) {
        creatorMessageId = creatorMessage.id
        
        // Attach photos if Jane mentions photos in her response
        const photoPaths = await attachPhotosToMessage(llmResponse.message, creator.id)
        console.log('[send-message] Photo paths:', photoPaths)
        if (photoPaths.length > 0) {
          // For MVP, photos are free. Later can add price_credits
          await saveMessageImages(creatorMessage.id, photoPaths, null)
          console.log('[send-message] Photos attached to message', creatorMessage.id)
        } else {
          console.log('[send-message] No photos attached - message does not mention photos')
        }
      }
    }
    
    // Get the actual user message from deduction result or fetch it
    let userMessage = deductionResult.message
    if (!userMessage) {
      // Fallback: fetch the last message from conversation
      const { data: lastMessage } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .eq('sender_account_id', account.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (lastMessage) {
        userMessage = lastMessage as any
      }
    }
    
    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      message: userMessage || {
        id: 'temp',
        conversation_id: conversation.id,
        sender_account_id: account.id,
        body: message.trim(),
        created_at: new Date().toISOString(),
      },
      creditsRemaining: deductionResult.creditsRemaining,
      creatorResponse: llmResponse.message,
      creatorMessageId,
    })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

