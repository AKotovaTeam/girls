import { getSupabaseServiceRole } from './supabase'
import { nanoid } from 'nanoid'
import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'session_token'
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000 // 30 days
const LOGIN_TOKEN_DURATION_MS = 15 * 60 * 1000 // 15 minutes

export interface Account {
  id: string
  creator_id: string
  email: string
  email_verified_at: string | null
  created_at: string
}

export interface Session {
  id: string
  account_id: string
  session_token: string
  expires_at: string
  created_at: string
}

/**
 * Gets or creates an account for a creator + email.
 * Returns the account (existing or newly created).
 */
export async function getOrCreateAccount(
  creatorId: string,
  email: string
): Promise<Account> {
  const supabase = getSupabaseServiceRole()
  
  // Try to find existing account
  const { data: existing } = await supabase
    .from('accounts')
    .select('*')
    .eq('creator_id', creatorId)
    .eq('email', email.toLowerCase())
    .single()
  
  if (existing) {
    return existing as Account
  }
  
  // Create new account
  const { data: newAccount, error } = await supabase
    .from('accounts')
    .insert({
      creator_id: creatorId,
      email: email.toLowerCase(),
    })
    .select()
    .single()
  
  if (error || !newAccount) {
    throw new Error(`Failed to create account: ${error?.message}`)
  }
  
  return newAccount as Account
}

/**
 * Creates a login token for magic link authentication.
 * Returns the token string.
 */
export async function createLoginToken(accountId: string): Promise<string> {
  const supabase = getSupabaseServiceRole()
  const token = nanoid(32)
  const expiresAt = new Date(Date.now() + LOGIN_TOKEN_DURATION_MS)
  
  const { error } = await supabase
    .from('login_tokens')
    .insert({
      account_id: accountId,
      token,
      expires_at: expiresAt.toISOString(),
    })
  
  if (error) {
    throw new Error(`Failed to create login token: ${error.message}`)
  }
  
  return token
}

/**
 * Consumes a login token and returns the account if valid.
 * Returns null if token is invalid, expired, or already consumed.
 */
export async function consumeLoginToken(token: string): Promise<Account | null> {
  const supabase = getSupabaseServiceRole()
  
  const { data: loginToken, error } = await supabase
    .from('login_tokens')
    .select('id, account_id')
    .eq('token', token)
    .is('consumed_at', null)
    .gt('expires_at', new Date().toISOString())
    .single()
  
  if (error || !loginToken) {
    return null
  }
  
  // Get the account
  const { data: account, error: accountError } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', loginToken.account_id)
    .single()
  
  if (accountError || !account) {
    return null
  }
  
  // Mark token as consumed
  await supabase
    .from('login_tokens')
    .update({ consumed_at: new Date().toISOString() })
    .eq('id', loginToken.id)
  
  return account as Account
}

/**
 * Creates a session for an account (without setting cookie).
 * Cookie must be set in Route Handler or Server Action.
 */
export async function createSession(accountId: string): Promise<{ session: Session; sessionToken: string }> {
  const supabase = getSupabaseServiceRole()
  const sessionToken = nanoid(64)
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
  
  const { data: session, error } = await supabase
    .from('sessions')
    .insert({
      account_id: accountId,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single()
  
  if (error || !session) {
    throw new Error(`Failed to create session: ${error?.message}`)
  }
  
  return { session: session as Session, sessionToken }
}

/**
 * Sets the session cookie. Must be called from Route Handler or Server Action.
 */
export async function setSessionCookie(sessionToken: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })
}

/**
 * Gets the current session from the cookie.
 * Returns null if no valid session found.
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value
  
  if (!sessionToken) {
    return null
  }
  
  const supabase = getSupabaseServiceRole()
  const { data: session, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .gt('expires_at', new Date().toISOString())
    .single()
  
  if (error || !session) {
    return null
  }
  
  return session as Session
}

/**
 * Gets the current account from the session.
 * Returns null if no valid session/account found.
 */
export async function getCurrentAccount(): Promise<Account | null> {
  const session = await getSession()
  if (!session) {
    return null
  }
  
  const supabase = getSupabaseServiceRole()
  const { data: account, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', session.account_id)
    .single()
  
  if (error || !account) {
    return null
  }
  
  return account as Account
}

/**
 * Deletes the current session (logout).
 */
export async function deleteSession(): Promise<void> {
  const session = await getSession()
  if (!session) {
    return
  }
  
  const supabase = getSupabaseServiceRole()
  await supabase
    .from('sessions')
    .delete()
    .eq('id', session.id)
  
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

