'use client'

import { useState } from 'react'

interface LoginFormProps {
  creatorId: string
  creatorDomain: string
}

export function LoginForm({ creatorId, creatorDomain }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, creatorId }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send magic link')
      }
      
      setMessage({
        type: 'success',
        text: 'Magic link sent! Check the terminal where "npm run dev" is running. Copy the link that starts with "http://test.localhost:3000" - НЕ используйте localhost:3000!'
      })
      setEmail('')
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred'
      })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="mt-4 sm:mt-8 space-y-4 sm:space-y-6 px-2">
      <div>
        <label htmlFor="email" className="block text-xs sm:text-sm font-light text-gray-700 mb-2">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input text-base sm:text-lg min-h-[44px]"
          placeholder="you@example.com"
        />
      </div>
      
      {message && (
        <div
          className={`p-4 sm:p-5 rounded-xl font-light text-sm sm:text-base ${
            message.type === 'success'
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 text-green-800 border-2 border-green-200 shadow-sm'
              : 'bg-red-50 text-red-800 border-2 border-red-200'
          }`}
        >
          <div className="flex items-start space-x-3">
            {message.type === 'success' ? (
              <span className="text-xl sm:text-2xl flex-shrink-0">✨</span>
            ) : (
              <span className="text-xl sm:text-2xl flex-shrink-0">⚠️</span>
            )}
            <p className="flex-1 leading-relaxed">{message.text}</p>
          </div>
        </div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-light text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:from-rose-500 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center"
      >
        {loading ? 'Sending magic link...' : 'Send Magic Link'}
      </button>
    </form>
  )
}

