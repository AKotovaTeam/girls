import { redirect } from 'next/navigation'
import { getCurrentAccount } from '@/lib/auth'
import { getTenantFromHost } from '@/lib/tenant'
import { headers } from 'next/headers'
import { getCreatorPosts } from '@/lib/content'
import { hasActiveSubscription } from '@/lib/subscription'
import Link from 'next/link'
import Image from 'next/image'
import { memo } from 'react'

// Constants
const AVATAR_SRC = '/jane-landing/0862341e72f81bd62eb70d28b8e394c6fa9279930b2d8271fdc3ab3ff3a98fda7cde223d.jpg'
const BLUR_FILTER = 'blur(40px) brightness(0.5)'
const BLUR_SCALE = 'scale(1.1)'

// Format date helper (memoized)
const formatDate = (date: string | null | undefined): string => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Post Header Component (memoized)
const PostHeader = memo(function PostHeader({ publishedAt }: { publishedAt?: string | null }) {
  return (
    <div className="p-3 sm:p-4 md:p-5">
      <div className="flex items-center space-x-3">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-rose-200/50 flex-shrink-0">
          <Image
            src={AVATAR_SRC}
            alt="Jane"
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-light text-gray-900 text-base sm:text-lg">Jane</h3>
          {publishedAt && (
            <p className="text-xs sm:text-sm text-gray-500">
              {formatDate(publishedAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
})

// Premium Overlay Component (memoized)
const PremiumOverlay = memo(function PremiumOverlay({ isGallery = false }: { isGallery?: boolean }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60 backdrop-blur-sm">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center z-10">
          <div className={`${isGallery ? 'text-4xl sm:text-5xl mb-2' : 'text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-5'} drop-shadow-lg`}>
            🔒
          </div>
          {isGallery ? (
            <p className="text-white font-light text-xs sm:text-sm drop-shadow-md">Subscribe</p>
          ) : (
            <>
              <p className="text-white font-light text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 drop-shadow-md">
                Subscribe to unlock
              </p>
              <Link
                href="/subscribe"
                className="inline-block bg-gradient-to-r from-rose-400 to-pink-500 text-white font-light px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 rounded-full hover:from-rose-500 hover:to-pink-600 transition-all duration-300 shadow-xl hover:shadow-2xl text-sm sm:text-base md:text-lg transform hover:scale-105"
              >
                Subscribe Now
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
})

// Blurred Image Component (memoized)
const BlurredImage = memo(function BlurredImage({ 
  src, 
  alt, 
  sizes, 
  priority = false 
}: { 
  src: string
  alt: string
  sizes: string
  priority?: boolean
}) {
  return (
    <div className="absolute inset-0" style={{ filter: BLUR_FILTER, transform: BLUR_SCALE }}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        unoptimized
        priority={priority}
      />
    </div>
  )
})

// Single Image Post Component (memoized)
const SingleImagePost = memo(function SingleImagePost({ 
  image, 
  title, 
  isPremium, 
  isSubscribed,
  priority = false 
}: { 
  image: { storage_path: string }
  title: string
  isPremium: boolean
  isSubscribed: boolean
  priority?: boolean
}) {
  if (isPremium && !isSubscribed) {
    return (
      <div className="relative w-full aspect-[4/5] sm:aspect-square overflow-hidden">
        <BlurredImage
          src={image.storage_path}
          alt={title}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 672px"
          priority={priority}
        />
        <PremiumOverlay />
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-square">
      <Image
        src={image.storage_path}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 672px"
        priority={priority}
      />
    </div>
  )
})

// Gallery Post Component (memoized)
const GalleryPost = memo(function GalleryPost({ 
  images, 
  title, 
  isPremium, 
  isSubscribed,
  priority = false 
}: { 
  images: Array<{ id: string; storage_path: string }>
  title: string
  isPremium: boolean
  isSubscribed: boolean
  priority?: boolean
}) {
  const displayImages = images.slice(0, 4)
  const isThreeImages = images.length === 3

  if (isPremium && !isSubscribed) {
    return (
      <div className="grid grid-cols-2 gap-1">
        {displayImages.map((image, idx) => (
          <div 
            key={image.id} 
            className={`relative ${isThreeImages && idx === 0 ? 'row-span-2' : 'aspect-square'} overflow-hidden`}
          >
            <BlurredImage
              src={image.storage_path}
              alt={`${title} - ${idx + 1}`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 336px"
              priority={priority && idx === 0}
            />
            {idx === 0 && <PremiumOverlay isGallery />}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-1">
      {displayImages.map((image, idx) => (
        <div 
          key={image.id} 
          className={`relative ${isThreeImages && idx === 0 ? 'row-span-2' : 'aspect-square'}`}
        >
          <Image
            src={image.storage_path}
            alt={`${title} - ${idx + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 336px"
            priority={priority && idx === 0}
            loading={idx === 0 ? undefined : 'lazy'}
          />
        </div>
      ))}
    </div>
  )
})

// Post Component (memoized)
const PostCard = memo(function PostCard({ 
  post, 
  isSubscribed, 
  priority = false 
}: { 
  post: {
    id: string
    title: string
    body_md?: string | null
    published_at?: string | null
    requires_subscription?: boolean
    images?: Array<{ id: string; storage_path: string }>
  }
  isSubscribed: boolean
  priority?: boolean
}) {
  const isPremium = post.requires_subscription || false
  const hasImages = post.images && post.images.length > 0
  const isSingleImage = hasImages && post.images!.length === 1

  return (
    <article className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <PostHeader publishedAt={post.published_at} />
      
      {post.body_md && (
        <div className="px-3 sm:px-4 md:px-5 py-2 sm:py-3">
          <p className="text-sm sm:text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
            {post.body_md}
          </p>
        </div>
      )}
      
      {hasImages && (
        <div className="relative">
          {isSingleImage ? (
            <SingleImagePost
              image={post.images![0]}
              title={post.title}
              isPremium={isPremium}
              isSubscribed={isSubscribed}
              priority={priority}
            />
          ) : (
            <GalleryPost
              images={post.images!}
              title={post.title}
              isPremium={isPremium}
              isSubscribed={isSubscribed}
              priority={priority}
            />
          )}
        </div>
      )}
    </article>
  )
})

export default async function AppPage() {
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
  
  const account = await getCurrentAccount()
  
  if (!account) {
    redirect('/login')
  }
  
  if (account.creator_id !== creator.id) {
    redirect('/login')
  }
  
  const [posts, isSubscribed] = await Promise.all([
    getCreatorPosts(creator.id),
    hasActiveSubscription(account.id, creator.id)
  ])
  
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
      {/* Profile Bio Section */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-start space-x-4 sm:space-x-5">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-2 ring-rose-200/50 flex-shrink-0">
              <Image
                src={AVATAR_SRC}
                alt="Jane"
                fill
                className="object-cover"
                sizes="96px"
                priority
              />
            </div>
            <div className="flex-1 pt-1 sm:pt-2">
              <h2 className="text-lg sm:text-xl md:text-2xl font-light text-gray-900 mb-2 sm:mb-3">
                {creator.display_name || creator.slug}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 font-light leading-relaxed">
                Photos I take with love. This isn't mass content — it's personal, it's about me and what I enjoy.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {posts.length === 0 ? (
        <div className="card text-center py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 sm:mb-5 md:mb-6">📭</div>
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2 sm:mb-3">
            No posts yet
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Check back later for new content!
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {posts.map((post, idx) => (
            <PostCard
              key={post.id}
              post={post}
              isSubscribed={isSubscribed}
              priority={idx < 2}
            />
          ))}
        </div>
      )}
    </div>
  )
}
