import { getSupabaseServiceRole } from './supabase'

export interface Subscription {
  id: string
  account_id: string
  creator_id: string
  status: string
  current_period_start: string | null
  current_period_end: string | null
}

/**
 * Checks if an account has an active subscription for a creator
 */
export async function hasActiveSubscription(
  accountId: string,
  creatorId: string
): Promise<boolean> {
  const supabase = getSupabaseServiceRole()
  
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('account_id', accountId)
    .eq('creator_id', creatorId)
    .eq('status', 'active')
    .single()
  
  if (error || !subscription) {
    return false
  }
  
  // Check if subscription is still valid (not expired)
  if (subscription.current_period_end) {
    const periodEnd = new Date(subscription.current_period_end)
    if (periodEnd < new Date()) {
      return false
    }
  }
  
  return true
}


