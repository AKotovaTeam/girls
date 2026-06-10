import { getTenantFromHost } from '@/lib/tenant'
import { headers } from 'next/headers'
import Link from 'next/link'
import { getCurrentAccount } from '@/lib/auth'
import Image from 'next/image'

const AVATAR_SRC = '/jane-landing/0862341e72f81bd62eb70d28b8e394c6fa9279930b2d8271fdc3ab3ff3a98fda7cde223d.jpg'

export default async function SubscribePage() {
  const host = (await headers()).get('host') || ''
  const creator = await getTenantFromHost(host)
  const account = await getCurrentAccount()
  
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/30 via-white to-pink-50/30 flex items-center justify-center py-4 sm:py-6 md:py-8 px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Header - Compact */}
        <div className="text-center mb-4 sm:mb-5">
          <div className="inline-block mb-3 sm:mb-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-3 ring-rose-200/50 mx-auto">
              <Image
                src={AVATAR_SRC}
                alt={creator.display_name || creator.slug}
                fill
                className="object-cover"
                sizes="80px"
                priority
              />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-900 mb-1.5 sm:mb-2 tracking-tight">
            Subscribe to {creator.display_name || creator.slug}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-light">
            Exclusive content & direct messages
          </p>
        </div>
        
        {/* Pricing Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Price Section - Compact */}
          <div className="bg-gradient-to-br from-rose-400 to-pink-500 text-white p-4 sm:p-5 md:p-6 text-center">
            <div className="text-4xl sm:text-5xl md:text-6xl font-light mb-1">$9.99</div>
            <div className="text-rose-100 text-xs sm:text-sm font-light">per month</div>
          </div>
          
          {/* Features - Compact */}
          <div className="p-4 sm:p-5 md:p-6">
            <ul className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5">
              <li className="flex items-start">
                <span className="text-rose-500 mr-2.5 sm:mr-3 text-lg sm:text-xl flex-shrink-0 mt-0.5">✓</span>
                <span className="text-gray-700 text-sm sm:text-base font-light leading-snug">
                  All exclusive photos
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-rose-500 mr-2.5 sm:mr-3 text-lg sm:text-xl flex-shrink-0 mt-0.5">✓</span>
                <span className="text-gray-700 text-sm sm:text-base font-light leading-snug">
                  {creator.included_message_limit} messages/month
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-rose-500 mr-2.5 sm:mr-3 text-lg sm:text-xl flex-shrink-0 mt-0.5">✓</span>
                <span className="text-gray-700 text-sm sm:text-base font-light leading-snug">
                  Direct messages
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-rose-500 mr-2.5 sm:mr-3 text-lg sm:text-xl flex-shrink-0 mt-0.5">✓</span>
                <span className="text-gray-700 text-sm sm:text-base font-light leading-snug">
                  Cancel anytime
                </span>
              </li>
            </ul>
            
            {/* CTA Button */}
            <button
              disabled
              className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-light text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3 rounded-full opacity-50 cursor-not-allowed mb-3 sm:mb-4 transition-all duration-300 shadow-md min-h-[44px] sm:min-h-[48px] flex items-center justify-center"
            >
              Subscribe with Stripe
            </button>
            
            <p className="text-xs text-gray-500 text-center font-light mb-3 sm:mb-4">
              Stripe integration coming soon
            </p>
            
            {/* Back Link - Compact */}
            <div className="text-center pt-3 sm:pt-4 border-t border-gray-100">
              <Link 
                href={account ? '/app' : '/'} 
                className="text-gray-600 hover:text-rose-600 transition-colors font-light text-xs sm:text-sm inline-block"
              >
                {account ? '← Back to Feed' : '← Back to Home'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
