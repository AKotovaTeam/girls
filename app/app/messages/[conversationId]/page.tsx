import { redirect } from 'next/navigation'
import { getCurrentAccount } from '@/lib/auth'
import { getTenantFromHost } from '@/lib/tenant'
import { headers } from 'next/headers'
import { getConversationMessages } from '@/lib/messages'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { MessageChat } from '@/components/MessageChat'

interface Message {
  id: string
  conversation_id: string
  sender_account_id: string
  body: string
  created_at: string
}

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>
}) {
  const host = (await headers()).get('host') || ''
  const creator = await getTenantFromHost(host)
  
  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600">Creator not found</p>
        </div>
      </div>
    )
  }
  
  const account = await getCurrentAccount()
  
  if (!account) {
    redirect('/login')
  }
  
  if (account.creator_id !== creator.id) {
    redirect('/login')
  }
  
  const { conversationId } = await params
  
  // Get messages
  const messages = await getConversationMessages(conversationId)
  
  // Get creator account ID (for identifying creator messages)
  const supabase = getSupabaseServiceRole()
  const creatorEmail = `creator@${creator.primary_domain.split(':')[0]}`
  const { data: creatorAccount } = await supabase
    .from('accounts')
    .select('id')
    .eq('creator_id', creator.id)
    .eq('email', creatorEmail)
    .single()
  
  const creatorAccountId = creatorAccount?.id || null
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
      <MessageChat
        conversationId={conversationId}
        initialMessages={messages}
        currentAccountId={account.id}
        creatorAccountId={creatorAccountId}
        creatorName={creator.display_name || creator.slug}
      />
    </div>
  )
}

