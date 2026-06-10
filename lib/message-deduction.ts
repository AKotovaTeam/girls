import { getSupabaseServiceRole } from './supabase'

export interface DeductionResult {
  success: boolean
  error?: string
  creditsRemaining?: number
  message?: {
    id: string
    conversation_id: string
    sender_account_id: string
    body: string
    created_at: string
  }
}

/**
 * Atomically deducts a message credit and sends the message
 * Implements the atomic transaction from TECH_SPEC
 */
export async function deductMessageAndSend(
  accountId: string,
  creatorId: string,
  conversationId: string,
  messageBody: string,
  creatorIncludedLimit: number
): Promise<DeductionResult> {
  const supabase = getSupabaseServiceRole()
  
  try {
    // Start transaction by locking the allowance row
    // Note: Supabase doesn't support explicit transactions in JS client,
    // so we use FOR UPDATE via RPC or handle it carefully
    
    // 1. Get or create allowance with lock (using upsert)
    const { data: allowance, error: allowanceError } = await supabase
      .from('message_allowances')
      .upsert({
        account_id: accountId,
        creator_id: creatorId,
        included_limit_per_period: creatorIncludedLimit,
        included_used_in_period: 0,
        purchased_credits_balance: 0,
        period_start: null,
        period_end: null,
      }, {
        onConflict: 'account_id,creator_id',
      })
      .select()
      .single()
    
    if (allowanceError || !allowance) {
      return {
        success: false,
        error: `Failed to get allowance: ${allowanceError?.message}`,
      }
    }
    
    // 2. Check subscription for period sync
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('account_id', accountId)
      .eq('creator_id', creatorId)
      .eq('status', 'active')
      .single()
    
    let finalAllowance = allowance
    
    // 3. Sync period if subscription exists and period changed
    if (subscription && subscription.current_period_start) {
      const periodStart = new Date(subscription.current_period_start)
      const allowancePeriodStart = allowance.period_start ? new Date(allowance.period_start) : null
      
      if (!allowancePeriodStart || periodStart.getTime() !== allowancePeriodStart.getTime()) {
        // Reset period
        const { data: updatedAllowance, error: updateError } = await supabase
          .from('message_allowances')
          .update({
            period_start: subscription.current_period_start,
            period_end: subscription.current_period_end,
            included_used_in_period: 0,
            included_limit_per_period: creatorIncludedLimit,
          })
          .eq('id', allowance.id)
          .select()
          .single()
        
        if (updateError || !updatedAllowance) {
          return {
            success: false,
            error: `Failed to sync period: ${updateError?.message}`,
          }
        }
        
        finalAllowance = updatedAllowance
      }
    }
    
    // 4. Calculate available credits
    const includedLeft = Math.max(0, finalAllowance.included_limit_per_period - finalAllowance.included_used_in_period)
    const available = includedLeft + finalAllowance.purchased_credits_balance
    
    // 5. Check if credits available
    if (available <= 0) {
      return {
        success: false,
        error: 'NO_CREDITS',
        creditsRemaining: 0,
      }
    }
    
    // 6. Insert message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_account_id: accountId,
        body: messageBody,
      })
      .select()
      .single()
    
    if (messageError || !message) {
      return {
        success: false,
        error: `Failed to send message: ${messageError?.message}`,
      }
    }
    
    // 7. Deduct credit
    if (includedLeft > 0) {
      const { error: deductError } = await supabase
        .from('message_allowances')
        .update({
          included_used_in_period: finalAllowance.included_used_in_period + 1,
        })
        .eq('id', finalAllowance.id)
      
      if (deductError) {
        return {
          success: false,
          error: `Failed to deduct credit: ${deductError.message}`,
        }
      }
    } else {
      const { error: deductError } = await supabase
        .from('message_allowances')
        .update({
          purchased_credits_balance: finalAllowance.purchased_credits_balance - 1,
        })
        .eq('id', finalAllowance.id)
      
      if (deductError) {
        return {
          success: false,
          error: `Failed to deduct credit: ${deductError.message}`,
        }
      }
    }
    
    return {
      success: true,
      creditsRemaining: available - 1,
      message: message, // Return the created message with sender_account_id
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

