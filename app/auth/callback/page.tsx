import { getTenantFromHost } from '@/lib/tenant'
import { headers } from 'next/headers'
import Link from 'next/link'

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }> | { token?: string; error?: string }
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

  const params = searchParams instanceof Promise ? await searchParams : searchParams
  const error = params?.error
  const token = params?.token

  if (error) {
    let errorMessage = 'An error occurred during authentication.'
    if (error === 'no_token') {
      errorMessage = 'No token provided in the magic link.'
    } else if (error === 'invalid_token') {
      errorMessage =
        'This link was already used or expired. Ask for a new one — and open it only by tapping Continue (messengers can burn links via preview).'
    } else if (error === 'invalid_domain') {
      errorMessage = 'This link is not valid for this domain.'
    } else if (error === 'server_error') {
      errorMessage = 'A server error occurred. Please try again.'
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-100 p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <Link
            href="/login"
            className="inline-block bg-gradient-to-r from-rose-400 to-pink-500 text-white font-light px-6 py-3 rounded-full hover:from-rose-500 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  if (token) {
    // Do NOT auto-consume the token here.
    // Slack/Telegram link previews hit GET URLs and would burn one-time tokens.
    // User must click Continue to hit /api/auth/callback and create a session.
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-100 p-8 max-w-md text-center">
          <h1 className="text-2xl font-light text-gray-900 mb-2">
            Sign in to {creator.display_name || creator.slug}
          </h1>
          <p className="text-gray-600 mb-8 text-sm">
            Tap the button below to continue. Opening this page alone does not use up your link.
          </p>
          <a
            href={`/api/auth/callback?token=${encodeURIComponent(token)}`}
            className="inline-block bg-gradient-to-r from-rose-400 to-pink-500 text-white font-light px-8 py-3 rounded-full hover:from-rose-500 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Continue
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 px-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-100 p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Link</h1>
        <p className="text-gray-600 mb-6">No token provided in the magic link.</p>
        <Link
          href="/login"
          className="inline-block bg-gradient-to-r from-rose-400 to-pink-500 text-white font-light px-6 py-3 rounded-full hover:from-rose-500 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Go to Login
        </Link>
      </div>
    </div>
  )
}
