import { getSupabaseServiceRole } from './supabase'

export interface Message {
  id: string
  conversation_id: string
  sender_account_id: string
  body: string
  created_at: string
}

export interface Conversation {
  id: string
  creator_id: string
  subscriber_account_id: string
  created_at: string
}

/**
 * Gets or creates a creator account for sending messages
 */
async function getOrCreateCreatorAccount(
  creatorId: string,
  primaryDomain: string
): Promise<string | null> {
  const supabase = getSupabaseServiceRole()
  
  const creatorEmail = `creator@${primaryDomain.split(':')[0]}`
  
  // Try to find existing creator account
  const { data: existing } = await supabase
    .from('accounts')
    .select('id')
    .eq('creator_id', creatorId)
    .eq('email', creatorEmail)
    .limit(1)
    .single()
  
  if (existing) {
    return existing.id
  }
  
  // Create creator account for auto-responses
  const { data: newAccount, error } = await supabase
    .from('accounts')
    .insert({
      creator_id: creatorId,
      email: creatorEmail,
    })
    .select()
    .single()
  
  if (error || !newAccount) {
    console.error('Failed to create creator account:', error?.message)
    return null
  }
  
  return newAccount.id
}

/**
 * Creates a welcome message from the creator
 */
async function createWelcomeMessage(
  conversationId: string,
  creatorAccountId: string,
  creatorDisplayName: string,
  includedMessageLimit: number
): Promise<void> {
  const supabase = getSupabaseServiceRole()
  
  const welcomeText = `Hey there! 👋

Welcome to my personal space! I'm ${creatorDisplayName}, and I'm so glad you're here. 

Here's what you can do on my site:

✨ **Free Content**: Browse my feed to see photos I share with everyone - no subscription needed!

🔒 **Premium Posts**: Subscribe to unlock exclusive content that I only share with my subscribers. These are more personal and intimate moments I capture.

💬 **Chat with Me**: You can message me anytime! I love connecting with you personally. Each message uses credits:
   • Subscribers get ${includedMessageLimit} free messages per month
   • You can also buy chat packs for additional credits that never expire
   • In our conversations, I can share special content just for you (available for purchase with credits)

🎁 **Special Content**: In our private messages, I can share exclusive photos and videos that aren't in my feed - available for purchase with credits.

I'd love to hear from you! Feel free to browse my feed, and if you want to see more, consider subscribing. You can always message me with any questions - I'm here to chat! 💕

Can't wait to connect with you! ✨`

  const { error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_account_id: creatorAccountId,
      body: welcomeText,
    })
  
  if (error) {
    console.error('Failed to create welcome message:', error.message)
  }
}

/**
 * Gets or creates a conversation between creator and subscriber
 * Automatically creates a welcome message for new conversations
 */
export async function getOrCreateConversation(
  creatorId: string,
  subscriberAccountId: string,
  creatorDisplayName?: string,
  primaryDomain?: string,
  includedMessageLimit?: number
): Promise<Conversation> {
  const supabase = getSupabaseServiceRole()
  
  // Try to get existing conversation
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('creator_id', creatorId)
    .eq('subscriber_account_id', subscriberAccountId)
    .single()
  
  if (existing) {
    return existing as Conversation
  }
  
  // Create new conversation
  const { data: conversation, error } = await supabase
    .from('conversations')
    .insert({
      creator_id: creatorId,
      subscriber_account_id: subscriberAccountId,
    })
    .select()
    .single()
  
  if (error || !conversation) {
    throw new Error(`Failed to create conversation: ${error?.message}`)
  }
  
  // Create welcome message if we have creator info
  if (primaryDomain && creatorDisplayName) {
    const creatorAccountId = await getOrCreateCreatorAccount(creatorId, primaryDomain)
    if (creatorAccountId) {
      // Get included_message_limit if not provided
      let messageLimit = includedMessageLimit
      if (!messageLimit) {
        const { data: creator } = await supabase
          .from('creators')
          .select('included_message_limit')
          .eq('id', creatorId)
          .single()
        messageLimit = creator?.included_message_limit || 20
      }
      await createWelcomeMessage(conversation.id, creatorAccountId, creatorDisplayName, messageLimit ?? 20)
    }
  }
  
  return conversation as Conversation
}

/**
 * Gets messages for a conversation
 */
export async function getConversationMessages(
  conversationId: string
): Promise<Message[]> {
  const supabase = getSupabaseServiceRole()
  
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  
  if (error || !messages) {
    return []
  }
  
  return messages as Message[]
}

/**
 * Gets creator account ID for a creator
 */
export async function getCreatorAccountId(creatorId: string): Promise<string | null> {
  const supabase = getSupabaseServiceRole()
  
  // For MVP, we'll use a placeholder or find the first account for the creator
  // In production, creators would have their own accounts
  // For now, return null and we'll handle it in the LLM response
  return null
}

/**
 * Gets count of unread messages from creator
 * For MVP: counts messages from creator that were sent after the last user message
 */
export async function getUnreadMessageCount(
  creatorId: string,
  subscriberAccountId: string,
  primaryDomain?: string
): Promise<number> {
  const supabase = getSupabaseServiceRole()
  
  // Get conversation
  const { data: conversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('creator_id', creatorId)
    .eq('subscriber_account_id', subscriberAccountId)
    .single()
  
  if (!conversation) {
    return 0
  }
  
  // Get creator account ID
  let creatorAccountId: string | null = null
  
  if (primaryDomain) {
    const creatorEmail = `creator@${primaryDomain.split(':')[0]}`
    const { data: creatorAccount } = await supabase
      .from('accounts')
      .select('id')
      .eq('creator_id', creatorId)
      .eq('email', creatorEmail)
      .limit(1)
      .single()
    
    creatorAccountId = creatorAccount?.id || null
  } else {
    // Fallback: get primary domain from creator
    const { data: creator } = await supabase
      .from('creators')
      .select('primary_domain')
      .eq('id', creatorId)
      .single()
    
    if (creator?.primary_domain) {
      const creatorEmail = `creator@${creator.primary_domain.split(':')[0]}`
      const { data: creatorAccount } = await supabase
        .from('accounts')
        .select('id')
        .eq('creator_id', creatorId)
        .eq('email', creatorEmail)
        .limit(1)
        .single()
      
      creatorAccountId = creatorAccount?.id || null
    }
  }
  
  if (!creatorAccountId) {
    return 0
  }
  
  // Get last user message timestamp
  const { data: lastUserMessage } = await supabase
    .from('messages')
    .select('created_at')
    .eq('conversation_id', conversation.id)
    .eq('sender_account_id', subscriberAccountId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  // Count messages from creator after last user message
  let query = supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('conversation_id', conversation.id)
    .eq('sender_account_id', creatorAccountId)
  
  if (lastUserMessage) {
    query = query.gt('created_at', lastUserMessage.created_at)
  }
  
  const { count } = await query
  
  return count || 0
}

