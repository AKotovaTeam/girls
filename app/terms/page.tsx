import { getTenantFromHost, isAdminHost } from '@/lib/tenant'
import { headers } from 'next/headers'
import Link from 'next/link'
import { getCurrentAccount } from '@/lib/auth'

export default async function TermsPage() {
  const host = (await headers()).get('host') || ''
  const creator = await getTenantFromHost(host)
  const admin = isAdminHost(host)
  const account = await getCurrentAccount()

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

  const backHref = account ? '/feed' : '/'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-16">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-2 tracking-tight">
        Terms & Conditions
      </h1>
      <p className="text-xs sm:text-sm text-gray-500 font-light mb-8">
        Last updated: August 31, 2026
      </p>

      <div className="space-y-6 text-sm sm:text-base text-gray-700 font-light leading-relaxed">
        <p>
          These Terms & Conditions govern your use of this website and related services
          provided on this creator domain. By creating an account or using the service,
          you agree to these terms.
        </p>
        <section>
          <h2 className="text-lg font-normal text-gray-900 mb-2">1. Account</h2>
          <p>
            You are responsible for keeping your login credentials secure and for activity
            under your account. You must provide accurate information when registering.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-normal text-gray-900 mb-2">2. Subscriptions and payments</h2>
          <p>
            Paid features (including subscriptions and message credit packs) are billed
            through the platform payment provider. Prices and included allowances are shown
            before you pay. Cancellations and refunds follow the payment provider and
            platform policies in effect at the time of purchase.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-normal text-gray-900 mb-2">3. Content and messaging</h2>
          <p>
            Content and messages are provided by the creator or by you as a subscriber.
            You may not misuse messaging, attempt unauthorized access, or use the service
            for illegal activity.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-normal text-gray-900 mb-2">4. Contact</h2>
          <p>
            For complaints or suggestions, use the{' '}
            <Link href="/contact" className="text-rose-600 hover:text-rose-700">
              Contact
            </Link>{' '}
            page.
          </p>
        </section>
        <p className="text-xs sm:text-sm text-gray-500 pt-2">
          Placeholder legal copy for MVP. Replace with final counsel-approved Terms before production launch.
        </p>
      </div>

      <div className="mt-10 text-center">
        <Link
          href={backHref}
          className="text-sm text-gray-600 hover:text-rose-600 transition-colors font-light"
        >
          ← Back
        </Link>
      </div>
    </div>
  )
}
