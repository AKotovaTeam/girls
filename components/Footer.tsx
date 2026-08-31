import Link from 'next/link'
import { getTenantFromHost, isAdminHost } from '@/lib/tenant'
import { headers } from 'next/headers'

export async function Footer() {
  const host = (await headers()).get('host') || ''
  const creator = await getTenantFromHost(host)
  const admin = isAdminHost(host)

  if (!creator && !admin) {
    return null
  }

  return (
    <footer className="border-t border-rose-100 bg-white/60 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600 font-light">
          <p>© {new Date().getFullYear()} {creator?.display_name || 'Platform'}</p>
          <Link
            href="/contact"
            className="text-gray-600 hover:text-rose-600 transition-colors"
          >
            Contact & feedback
          </Link>
        </div>
      </div>
    </footer>
  )
}
