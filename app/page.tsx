import { getTenantFromHost } from '@/lib/tenant'
import { headers } from 'next/headers'
import Link from 'next/link'
import { getCurrentAccount } from '@/lib/auth'
import Image from 'next/image'

export default async function HomePage() {
  const host = (await headers()).get('host') || ''
  const creator = await getTenantFromHost(host)
  const account = await getCurrentAccount()
  
  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600">This domain is not associated with any creator.</p>
        </div>
      </div>
    )
  }
  
  // Landing photos for Jane
  const landingPhotos = [
    '/jane-landing/0862341e72f81bd62eb70d28b8e394c6fa9279930b2d8271fdc3ab3ff3a98fda7cde223d.jpg',
    '/jane-landing/88ca33a0a20e14dbca18e56246efb989e078f5ba002d7b96f4d43fafb139173fb8852cd2-2.jpg',
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white via-pink-50/30 to-purple-50/20 relative">
      {/* Hero Section with Photo */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6 md:pb-8">
          {/* Hero Content - Split Layout on Large Screens */}
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 xl:gap-12 items-center mb-4 sm:mb-6 md:mb-8">
            {/* Text Content */}
            <div className="text-center lg:text-left space-y-2 sm:space-y-3 md:space-y-4 order-2 lg:order-1">
              <div className="inline-block mb-1 sm:mb-2">
                <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-light bg-rose-100/80 text-rose-700 border border-rose-200/50 backdrop-blur-sm">
                  Personal Invitation Only
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 tracking-tight leading-[1.1]">
                <span className="block">Hi, I'm</span>
                <span className="block bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Jane
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800 font-light leading-relaxed max-w-xl lg:max-w-none mx-auto lg:mx-0">
                If you're here, I invited you personally{' '}
                <span className="inline-block animate-pulse">✨</span>
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 font-light leading-relaxed max-w-xl lg:max-w-lg mx-auto lg:mx-0 mb-4 sm:mb-5 md:mb-6">
                I created this site to combine two things: my love for photography and the chance to earn some extra money without paying crazy commissions.
              </p>
              {!account && (
                <div className="pt-2 sm:pt-3 md:pt-4">
                  <Link 
                    href="/login" 
                    className="inline-block bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500 text-white font-light text-sm sm:text-base md:text-lg px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 rounded-full shadow-xl hover:shadow-2xl transition-shadow duration-300 min-h-[44px] md:min-h-[52px] flex items-center justify-center"
                  >
                    Sign in
                  </Link>
                </div>
              )}
            </div>
            
            {/* Main Photo */}
            {landingPhotos[0] && (
              <div className="relative order-1 lg:order-2">
                <div className="relative aspect-[4/5] rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-2xl sm:shadow-3xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
                  <Image
                    src={landingPhotos[0]}
                    alt="Jane"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 ring-2 ring-rose-200/50 rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] pointer-events-none"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Personal Story Section */}
      <div className="max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-4 sm:pb-6 md:pb-8">
        <div className="relative bg-gradient-to-br from-white/90 via-white/70 to-rose-50/40 rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-6 lg:p-8 shadow-xl border border-rose-100/50 mb-4 sm:mb-6 md:mb-8">
          <div>
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-rose-300 to-transparent"></div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-900 mx-3 sm:mx-4">
                Why this site?
              </h2>
              <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent via-rose-300 to-transparent"></div>
            </div>
            <div className="space-y-2 sm:space-y-3 text-gray-700 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-4xl mx-auto">
              <p className="relative pl-4 sm:pl-6 border-l-2 border-rose-200/50">
                I don't buy ads. I find people I'm interested in myself and invite them to visit my site. 
                <span className="block mt-1 sm:mt-2 text-rose-600/80">That means if you're here — you're special to me.</span>
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-medium bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent text-center py-1 sm:py-2">
                No middlemen. No huge commissions. Just me and you.
              </p>
            </div>
          </div>
        </div>

        {/* Features - Enhanced Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-white/90 to-rose-50/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-rose-100/50 text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">📸</div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-light text-gray-900 mb-2">My Photos</h3>
            <p className="text-gray-600 font-light text-xs sm:text-sm md:text-base leading-relaxed">
              Exclusive photos I take myself
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white/90 to-pink-50/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-pink-100/50 text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">💬</div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-light text-gray-900 mb-2">Direct Messages</h3>
            <p className="text-gray-600 font-light text-xs sm:text-sm md:text-base leading-relaxed">
              Message me directly — I'll reply myself
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white/90 to-purple-50/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-purple-100/50 text-center sm:col-span-2 lg:col-span-1">
            <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">✨</div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-light text-gray-900 mb-2">No Middlemen</h3>
            <p className="text-gray-600 font-light text-xs sm:text-sm md:text-base leading-relaxed">
              All money goes to me, not the platform
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center px-2 sm:px-4 pb-4 sm:pb-6">
          {account ? (
            <Link 
              href="/app" 
              className="inline-block bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500 text-white font-light text-base sm:text-lg md:text-xl px-10 sm:px-12 md:px-16 lg:px-20 py-4 sm:py-5 md:py-6 rounded-full shadow-xl hover:shadow-2xl transition-shadow duration-300 min-h-[52px] md:min-h-[60px] flex items-center justify-center"
            >
              Go to Profile
            </Link>
          ) : (
            <div>
              <Link 
                href="/login" 
                className="inline-block text-gray-700 font-light text-xs sm:text-sm md:text-base px-6 sm:px-8 md:px-10 py-2 sm:py-3 md:py-4 rounded-full bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white/80 hover:border-gray-300 transition-all duration-300 min-h-[36px] md:min-h-[44px] flex items-center justify-center shadow-sm hover:shadow-md"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Elements - Static (no animation for better performance) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-4 sm:left-10 w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gradient-to-br from-rose-200/20 to-pink-300/15 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-40 right-4 sm:right-10 w-36 h-36 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-gradient-to-bl from-pink-200/20 to-purple-200/15 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-1/2 w-44 h-44 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gradient-to-tr from-rose-300/20 to-pink-200/15 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>
    </div>
  )
}
