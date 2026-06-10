import { getSupabaseServiceRole } from './supabase'

export interface Creator {
  id: string
  slug: string
  primary_domain: string
  display_name: string | null
  bio: string | null
  brand_json: Record<string, any>
  included_message_limit: number
  is_active: boolean
  created_at: string
}

/**
 * Resolves creator (tenant) from request Host header.
 * Host must match creators.primary_domain (case-insensitive, port stripped).
 * Returns null if no creator found (should return 404).
 */
export type TenantResolveError = 'db_error' | 'not_found'

export async function resolveTenant(host: string): Promise<Creator | null> {
  const { creator } = await resolveTenantDetailed(host)
  return creator
}

export async function resolveTenantDetailed(host: string): Promise<{
  creator: Creator | null
  error: TenantResolveError | null
}> {
  // Strip port from host and normalize to lowercase
  const hostWithoutPort = host.split(':')[0].toLowerCase()
  
  // Debug in development
  if (process.env.NODE_ENV === 'development') {
    console.log('resolveTenant - host:', host, 'hostWithoutPort:', hostWithoutPort)
  }
  
  const supabase = getSupabaseServiceRole()
  
  // Fetch all active creators and match by domain (handling port in primary_domain)
  const { data: creators, error } = await supabase
    .from('creators')
    .select('*')
    .eq('is_active', true)
  
  if (error || !creators) {
    if (process.env.NODE_ENV === 'development') {
      console.log('resolveTenant - error fetching creators:', error)
    }
    return { creator: null, error: 'db_error' }
  }
  
  // Debug in development
  if (process.env.NODE_ENV === 'development') {
    console.log('resolveTenant - found creators:', creators.map(c => ({ slug: c.slug, primary_domain: c.primary_domain })))
  }
  
  // Find creator with matching domain (case-insensitive, port-stripped)
  const creator = creators.find(c => {
    const creatorDomain = c.primary_domain.split(':')[0].toLowerCase()
    const matches = creatorDomain === hostWithoutPort
    if (process.env.NODE_ENV === 'development') {
      console.log(`resolveTenant - comparing: "${creatorDomain}" === "${hostWithoutPort}" = ${matches}`)
    }
    return matches
  })
  
  if (process.env.NODE_ENV === 'development') {
    console.log('resolveTenant - result:', creator ? creator.slug : 'null')
  }
  
  if (!creator) {
    return { creator: null, error: 'not_found' }
  }

  return { creator: creator as Creator, error: null }
}

/**
 * Checks if the current host is the admin host.
 */
export function isAdminHost(host: string): boolean {
  const adminHost = process.env.ADMIN_HOST || 'admin.localhost:3000'
  const hostWithoutPort = host.split(':')[0].toLowerCase()
  const adminHostWithoutPort = adminHost.split(':')[0].toLowerCase()
  
  return hostWithoutPort === adminHostWithoutPort
}

/**
 * Middleware helper to get tenant from host string.
 * Returns null if host doesn't match any creator (should 404).
 */
export async function getTenantFromHost(host: string): Promise<Creator | null> {
  // Admin host should not resolve to a creator
  if (isAdminHost(host)) {
    return null
  }
  
  return resolveTenant(host)
}

/**
 * @deprecated Use getTenantFromHost instead
 */
export async function getTenantFromRequest(request: Request): Promise<Creator | null> {
  const host = request.headers.get('host') || ''
  return getTenantFromHost(host)
}

