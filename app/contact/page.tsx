import { getTenantFromHost, isAdminHost } from '@/lib/tenant'
import { headers } from 'next/headers'
import Link from 'next/link'

function getContactEmail(): string {
  return process.env.PLATFORM_CONTACT_EMAIL?.trim() || 'support@example.com'
}

export default async function ContactPage() {
  const host = (await headers()).get('host') || ''
  const creator = await getTenantFromHost(host)
  const admin = isAdminHost(host)
  const email = getContactEmail()

  if (!creator && !admin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600">Page not available on this domain.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-16">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-3 tracking-tight">
        Contact & feedback
      </h1>
      <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed mb-8">
        For questions, complaints, or suggestions about the platform, please email us directly.
        We do not operate an in-app moderation or ticketing system — all requests are handled by email.
      </p>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <p className="text-sm text-gray-600 font-light mb-4">Platform support</p>
        <a
          href={`mailto:${email}?subject=${encodeURIComponent('Platform feedback')}`}
          className="inline-block text-lg sm:text-xl font-light text-rose-600 hover:text-rose-700 transition-colors break-all"
        >
          {email}
        </a>
        <p className="mt-6 text-xs sm:text-sm text-gray-500 font-light leading-relaxed">
          Include as much detail as possible. For account-specific issues, use the email address
          linked to your account.
        </p>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-gray-600 hover:text-rose-600 transition-colors font-light"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
