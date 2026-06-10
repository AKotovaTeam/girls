import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getCurrentAccount } from '@/lib/auth'
import { getTenantFromHost } from '@/lib/tenant'
import { getConversationMessages } from '@/lib/messages'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
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
    
    const { conversationId } = await params
    const messages = await getConversationMessages(conversationId)
    
    return NextResponse.json({
      messages,
    })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}


