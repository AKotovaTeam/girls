'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  async function handleLogout() {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      if (res.ok) {
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-light text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors min-h-[36px] sm:min-h-[40px] flex items-center justify-center"
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  )
}

