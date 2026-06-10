import { redirect } from 'next/navigation'
import { getCurrentAccount } from '@/lib/auth'
import { getTenantFromHost } from '@/lib/tenant'
import { headers } from 'next/headers'
import { getOrCreateConversation } from '@/lib/messages'

export default async function MessagesPage() {
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
  
  // Auto-create conversation with welcome message if it doesn't exist
  // Then immediately redirect to the conversation
  const conversation = await getOrCreateConversation(
    creator.id,
    account.id,
    creator.display_name || creator.slug,
    creator.primary_domain,
    creator.included_message_limit
  )
  
  // Redirect directly to the conversation
  redirect(`/app/messages/${conversation.id}`)
}

