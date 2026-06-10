import { NextResponse } from 'next/server'
import { consumeLoginToken, createSession, setSessionCookie } from '@/lib/auth'
import { getTenantFromHost } from '@/lib/tenant'
import { headers } from 'next/headers'

export async function GET(request: Request) {
  try {
    const host = (await headers()).get('host') || ''
    
    // Debug: log host in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth callback API - host:', host)
    }
    
    const creator = await getTenantFromHost(host)
    
    if (!creator) {
      // Debug: log why creator not found
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth callback API - creator not found for host:', host)
      }
      
      // Return user-friendly error page instead of JSON
      const redirectUrl = new URL(request.url)
      redirectUrl.pathname = '/login'
      redirectUrl.search = `?error=creator_not_found&host=${encodeURIComponent(host)}`
      return NextResponse.redirect(redirectUrl)
    }
    
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      const redirectUrl = new URL(request.url)
      redirectUrl.pathname = '/login'
      redirectUrl.search = '?error=no_token'
      return NextResponse.redirect(redirectUrl)
    }
    
    // Consume the login token
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth callback API - consuming token:', token.substring(0, 10) + '...')
    }
    
    const account = await consumeLoginToken(token)
    
    if (!account) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth callback API - token invalid or expired')
      }
      const redirectUrl = new URL(request.url)
      redirectUrl.pathname = '/login'
      redirectUrl.search = '?error=invalid_token'
      return NextResponse.redirect(redirectUrl)
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth callback API - account found:', account.id, 'creator_id:', account.creator_id)
    }
    
    // Verify account belongs to this creator
    if (account.creator_id !== creator.id) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth callback API - account creator mismatch:', account.creator_id, 'vs', creator.id)
      }
      const redirectUrl = new URL(request.url)
      redirectUrl.pathname = '/login'
      redirectUrl.search = '?error=invalid_domain'
      return NextResponse.redirect(redirectUrl)
    }
    
    // Create session and get token
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth callback API - creating session for account:', account.id)
    }
    
    const { sessionToken } = await createSession(account.id)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    
    // Set cookie in Route Handler (this is allowed)
    await setSessionCookie(sessionToken, expiresAt)
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth callback API - session created, cookie set')
    }
    
    // Redirect to app - use the same origin to preserve host
    // Use origin from request to preserve the correct host (test.localhost:3000)
    const url = new URL(request.url)
    const redirectUrl = `${url.origin}/app`
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth callback API - redirecting to:', redirectUrl)
    }
    
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('Auth callback error:', error)
    const redirectUrl = new URL(request.url)
    redirectUrl.pathname = '/login'
    redirectUrl.search = '?error=server_error'
    return NextResponse.redirect(redirectUrl)
  }
}

