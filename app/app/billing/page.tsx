import { redirect } from 'next/navigation'
import { getCurrentAccount } from '@/lib/auth'
import { getTenantFromHost } from '@/lib/tenant'
import { headers } from 'next/headers'
import { getSupabaseServiceRole } from '@/lib/supabase'
import Link from 'next/link'

interface Subscription {
  id: string
  status: string
  current_period_start: string | null
  current_period_end: string | null
}

interface MessageAllowance {
  included_limit_per_period: number
  included_used_in_period: number
  purchased_credits_balance: number
  period_start: string | null
  period_end: string | null
}

export default async function BillingPage() {
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
  
  // Get subscription and allowances
  const supabase = getSupabaseServiceRole()
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('account_id', account.id)
    .eq('creator_id', creator.id)
    .single()
  
  const { data: allowance } = await supabase
    .from('message_allowances')
    .select('*')
    .eq('account_id', account.id)
    .eq('creator_id', creator.id)
    .single()
  
  const sub = subscription as Subscription | null
  const allow = allowance as MessageAllowance | null
  
  const isSubscribed = sub && sub.status === 'active'
  const includedLeft = allow 
    ? Math.max(0, allow.included_limit_per_period - allow.included_used_in_period)
    : creator.included_message_limit
  const purchasedCredits = allow?.purchased_credits_balance || 0
  const totalAvailable = includedLeft + purchasedCredits
  const usagePercent = allow 
    ? Math.min(100, (includedLeft / allow.included_limit_per_period) * 100)
    : 100
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-1.5 sm:mb-2 tracking-tight">
          Credits & Subscription
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-light">
          Manage your subscription and message credits
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-5 sm:mb-6 md:mb-8">
        {/* Subscription Status */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-light text-gray-900 mb-4 sm:mb-5">
            Subscription
          </h2>
          {isSubscribed ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-light bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 border border-rose-200/50">
                  ✓ Active
                </span>
              </div>
              {sub?.current_period_end && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs sm:text-sm text-gray-600 font-light">
                    Renews on{' '}
                    <span className="font-medium text-gray-900">
                      {new Date(sub.current_period_end).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm sm:text-base text-gray-600 font-light">
                No active subscription
              </p>
              <Link 
                href="/subscribe" 
                className="inline-block bg-gradient-to-r from-rose-400 to-pink-500 text-white font-light text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:from-rose-500 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Subscribe Now
              </Link>
            </div>
          )}
        </div>
        
        {/* Message Credits */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-light text-gray-900 mb-4 sm:mb-5">
            Message Credits
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {/* Included Credits */}
            <div>
              <div className="flex justify-between items-center text-xs sm:text-sm mb-2">
                <span className="text-gray-600 font-light">Included (this period)</span>
                <span className="font-light text-gray-900">
                  {includedLeft} / {allow?.included_limit_per_period || creator.included_message_limit}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 sm:h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-rose-400 to-pink-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
            
            {/* Purchased Credits */}
            <div className="flex justify-between items-center text-xs sm:text-sm pt-2 border-t border-gray-100">
              <span className="text-gray-600 font-light">Purchased credits</span>
              <span className="font-light text-gray-900">{purchasedCredits}</span>
            </div>
            
            {/* Total Available */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-light text-gray-900 text-sm sm:text-base">Total available</span>
                <span className="font-light text-2xl sm:text-3xl bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                  {totalAvailable}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Packs */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 md:p-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-light text-gray-900 mb-3 sm:mb-4">
          Buy More Credits
        </h2>
        <p className="text-sm sm:text-base text-gray-600 font-light mb-4 sm:mb-5">
          Purchase chat packs to get additional message credits that never expire.
        </p>
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 text-center border border-rose-100/50">
          <p className="text-sm sm:text-base text-gray-600 font-light">
            Chat pack products coming soon
          </p>
        </div>
      </div>
    </div>
  )
}
