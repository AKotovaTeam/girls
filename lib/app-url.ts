/**
 * Base URL for magic links and redirects.
 * PUBLIC_APP_URL overrides creator domain when sharing dev with colleagues.
 */
export function getAppBaseUrl(creatorDomain: string): string {
  const publicUrl = process.env.PUBLIC_APP_URL?.trim()
  if (publicUrl) {
    return publicUrl.replace(/\/$/, '')
  }

  // Vercel sets VERCEL_URL automatically (e.g. girls-xxx.vercel.app)
  const vercelUrl = process.env.VERCEL_URL?.trim()
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/$/, '')}`
  }

  const host = creatorDomain.split(':')[0].toLowerCase()
  const isLocal =
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host === '127.0.0.1'

  const protocol = isLocal ? 'http' : 'https'
  return `${protocol}://${creatorDomain}`
}

export function buildMagicLink(creatorDomain: string, token: string): string {
  // Use /auth/callback (confirm page), not /api/auth/callback.
  // Messengers preview GET links and would burn one-time tokens instantly.
  return `${getAppBaseUrl(creatorDomain)}/auth/callback?token=${token}`
}
