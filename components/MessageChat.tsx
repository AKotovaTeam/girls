'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface MessageImage {
  id: string
  message_id: string
  storage_path: string
  sort_order: number
  price_credits: number | null
  signedUrl?: string | null
  isFree?: boolean
  hasPurchased?: boolean
  canView?: boolean
}

interface Message {
  id: string
  conversation_id: string
  sender_account_id: string
  body: string
  created_at: string
  images?: MessageImage[]
}

interface MessageChatProps {
  conversationId: string
  initialMessages: Message[]
  currentAccountId: string
  creatorAccountId: string | null
  creatorName: string
}

export function MessageChat({
  conversationId,
  initialMessages,
  currentAccountId,
  creatorAccountId,
  creatorName,
}: MessageChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null)
  const [messageImages, setMessageImages] = useState<Record<string, MessageImage[]>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load images for messages
  useEffect(() => {
    const loadImages = async () => {
      for (const message of messages) {
        // Skip temp messages and already loaded images
        if (message.id && !message.id.startsWith('temp') && !messageImages[message.id]) {
          try {
            const response = await fetch(`/api/messages/${conversationId}/images?messageId=${message.id}`)
            if (response.ok) {
              const data = await response.json()
              if (data.images && data.images.length > 0) {
                setMessageImages(prev => ({
                  ...prev,
                  [message.id]: data.images,
                }))
              }
            }
          } catch (err) {
            // Silently fail - images are optional
          }
        }
      }
    }
    loadImages()
  }, [messages, conversationId, messageImages])
  
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || loading) return
    
    const messageText = input.trim()
    setInput('')
    setLoading(true)
    setError(null)
    
    // Optimistically add user message
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: conversationId,
      sender_account_id: currentAccountId,
      body: messageText,
      created_at: new Date().toISOString(),
    }
    
    setMessages(prev => [...prev, tempUserMessage])
    
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          conversationId,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        if (response.status === 402 && data.error === 'NO_CREDITS') {
          setError('No message credits remaining. Please purchase more credits or subscribe.')
          setCreditsRemaining(0)
          // Remove optimistic message
          setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id))
        } else {
          setError(data.error || 'Failed to send message')
          // Remove optimistic message
          setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id))
        }
        return
      }
      
      // Replace temp message with real one (preserve sender_account_id if not in response)
      setMessages(prev => prev.map(m => {
        if (m.id === tempUserMessage.id) {
          // Ensure sender_account_id is preserved
          return {
            ...data.message,
            sender_account_id: data.message.sender_account_id || currentAccountId,
          }
        }
        return m
      }))
      
      // Refresh messages to get creator response from database (including photos)
      if (data.creatorMessageId || data.creatorResponse) {
        // Wait longer to ensure photos are saved, then refresh multiple times
        const refreshMessages = async (attempt = 1) => {
          try {
            const refreshResponse = await fetch(`/api/messages/${conversationId}`)
            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json()
              setMessages(refreshData.messages || [])
              // Clear messageImages cache to force reload
              setMessageImages({})
              
              // If we have creator message ID, try to load images immediately
              if (data.creatorMessageId && attempt <= 3) {
                setTimeout(() => {
                  // Force reload images for this message
                  fetch(`/api/messages/${conversationId}/images?messageId=${data.creatorMessageId}`)
                    .then(res => res.json())
                    .then(data => {
                      if (data.images && data.images.length > 0) {
                        setMessageImages(prev => ({
                          ...prev,
                          [data.creatorMessageId]: data.images,
                        }))
                      }
                    })
                    .catch(() => {})
                }, 500 * attempt)
              }
            }
          } catch (err) {
            // If refresh fails, add creator response manually
            if (data.creatorResponse && attempt === 1) {
              const creatorMessage: Message = {
                id: data.creatorMessageId || `creator-${Date.now()}`,
                conversation_id: conversationId,
                sender_account_id: 'creator-placeholder', // Will be filtered in isUserMessage
                body: data.creatorResponse,
                created_at: new Date().toISOString(),
              }
              setMessages(prev => [...prev, creatorMessage])
            }
          }
        }
        
        // Try multiple times to ensure photos are loaded
        setTimeout(() => refreshMessages(1), 2000) // First attempt after 2 seconds
        setTimeout(() => refreshMessages(2), 3500) // Second attempt after 3.5 seconds
        setTimeout(() => refreshMessages(3), 5000) // Third attempt after 5 seconds
      }
      
      if (data.creditsRemaining !== undefined) {
        setCreditsRemaining(data.creditsRemaining)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
      // Remove optimistic message
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id))
    } finally {
      setLoading(false)
    }
  }
  
  const isUserMessage = (message: Message) => {
    // User message if sender is current account AND not creator account
    // Always check creatorAccountId first if it exists
    if (creatorAccountId) {
      // If sender is creator account, it's not a user message
      if (message.sender_account_id === creatorAccountId) {
        return false
      }
      // If sender is current account and not creator, it's a user message
      return message.sender_account_id === currentAccountId
    }
    // Fallback: if creatorAccountId is null, check for placeholder
    // User message if sender is current account and not placeholder
    return message.sender_account_id === currentAccountId && 
           message.sender_account_id !== 'creator-placeholder'
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 md:p-6 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-rose-200/50 flex-shrink-0">
            <Image
              src="/jane-landing/0862341e72f81bd62eb70d28b8e394c6fa9279930b2d8271fdc3ab3ff3a98fda7cde223d.jpg"
              alt={creatorName}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div>
            <h2 className="font-light text-gray-900 text-base sm:text-lg md:text-xl">
              {creatorName}
            </h2>
            {creditsRemaining !== null && (
              <p className="text-xs sm:text-sm text-gray-500">
                {creditsRemaining} credits remaining
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 sm:gap-3 ${isUserMessage(message) ? 'justify-end' : 'justify-start'}`}
            >
              {!isUserMessage(message) && (
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-rose-200/50 flex-shrink-0">
                  <Image
                    src="/jane-landing/0862341e72f81bd62eb70d28b8e394c6fa9279930b2d8271fdc3ab3ff3a98fda7cde223d.jpg"
                    alt={creatorName}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              )}
              <div
                className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                  isUserMessage(message)
                    ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {/* Message Images */}
                {messageImages[message.id] && messageImages[message.id].length > 0 && (
                  <div className="mb-3 space-y-2">
                    {messageImages[message.id].map((image) => (
                      <div key={image.id} className="relative rounded-lg overflow-hidden">
                        {image.canView && image.signedUrl ? (
                          <Image
                            src={image.signedUrl}
                            alt="Message photo"
                            width={400}
                            height={400}
                            className="w-full h-auto object-cover rounded-lg"
                            unoptimized
                          />
                        ) : (
                          <div className="relative w-full aspect-square bg-gray-200 flex items-center justify-center">
                            <div className="text-center p-4">
                              <div className="text-4xl mb-2">🔒</div>
                              <p className="text-sm text-gray-600">
                                {image.price_credits ? `Purchase for ${image.price_credits} credits` : 'Locked'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm sm:text-base whitespace-pre-wrap">
                  {message.body}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isUserMessage(message) ? 'text-rose-100' : 'text-gray-500'
                  }`}
                >
                  {new Date(message.created_at).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Error message */}
      {error && (
        <div className="px-4 sm:px-5 md:px-6 py-2 bg-red-50 border-t border-red-100">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {/* Input */}
      <form onSubmit={handleSend} className="p-4 sm:p-5 md:px-6 border-t border-gray-100">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-sm sm:text-base"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-full hover:from-rose-500 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-light text-sm sm:text-base"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
}

