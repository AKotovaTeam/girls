import { NextResponse } from 'next/server'
import { getOrCreateAccount, createLoginToken } from '@/lib/auth'
import { sendMagicLinkEmail } from '@/lib/email'
import { resolveTenant } from '@/lib/tenant'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, creatorId } = await request.json()
    
    if (!email || !creatorId) {
      return NextResponse.json(
        { error: 'Email and creatorId are required' },
        { status: 400 }
      )
    }
    
    // Verify creator exists
    const host = (await headers()).get('host') || ''
    const creator = await resolveTenant(host)
    
    if (!creator || creator.id !== creatorId) {
      return NextResponse.json(
        { error: 'Invalid creator' },
        { status: 404 }
      )
    }
    
    // Get or create account
    const account = await getOrCreateAccount(creatorId, email)
    
    // Create login token
    const token = await createLoginToken(account.id)
    
    // Send magic link email
    await sendMagicLinkEmail(email, creator.primary_domain, token)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}


