import Link from 'next/link'
import { getCurrentAccount } from '@/lib/auth'
import { getTenantFromHost } from '@/lib/tenant'
import { headers } from 'next/headers'
import { LogoutButton } from './LogoutButton'
import { getUnreadMessageCount } from '@/lib/messages'

export async function Header() {
  const host = (await headers()).get('host') || ''
  const creator = await getTenantFromHost(host)
  const account = await getCurrentAccount()
  
  if (!creator) {
    return null
  }
  
  // Get unread message count
  let unreadCount = 0
  if (account) {
    unreadCount = await getUnreadMessageCount(creator.id, account.id, creator.primary_domain)
  }
  
  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl xl:max-w-[90rem] 2xl:max-w-[100rem] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20 lg:h-24">
          <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-10">
            <Link href="/" className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 tracking-wide">
              Jane
            </Link>
            {account && (
              <nav className="hidden md:flex space-x-6 lg:space-x-8 xl:space-x-10">
                <Link href="/app" className="text-gray-600 hover:text-rose-600 transition-colors font-light text-sm md:text-base lg:text-lg">
                  Feed
                </Link>
                <Link href="/app/messages" className="relative text-gray-600 hover:text-rose-600 transition-colors font-light text-sm md:text-base lg:text-lg">
                  Messages
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 sm:-right-3 flex items-center justify-center min-w-[18px] sm:min-w-[20px] h-4 sm:h-5 px-1 sm:px-1.5 text-xs font-medium text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-full border-2 border-white shadow-sm">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link href="/app/billing" className="text-gray-600 hover:text-rose-600 transition-colors font-light text-sm md:text-base lg:text-lg">
                  Credits
                </Link>
              </nav>
            )}
          </div>
                 <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6">
                   {account ? (
                     <>
                       <span className="hidden sm:inline text-xs sm:text-sm md:text-base text-gray-600 font-light truncate max-w-[120px] md:max-w-[180px] lg:max-w-none">{account.email}</span>
                       <LogoutButton />
                     </>
                   ) : (
                     <Link href="/login" className="text-gray-600 hover:text-rose-600 transition-colors font-light text-sm sm:text-base md:text-lg px-2 sm:px-3 md:px-4">
                       Log in
                     </Link>
                   )}
                 </div>
        </div>
        {account && (
          <nav className="md:hidden border-t border-rose-100 pt-2 pb-2 mt-2">
            <div className="flex space-x-4 overflow-x-auto">
              <Link href="/app" className="text-gray-600 hover:text-rose-600 transition-colors font-light text-sm whitespace-nowrap">
                Feed
              </Link>
              <Link href="/app/messages" className="relative text-gray-600 hover:text-rose-600 transition-colors font-light text-sm whitespace-nowrap">
                Messages
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[16px] h-4 px-1 text-xs font-medium text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-full border-2 border-white shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              <Link href="/app/billing" className="text-gray-600 hover:text-rose-600 transition-colors font-light text-sm whitespace-nowrap">
                Credits
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

