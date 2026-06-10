import { getSupabaseServiceRole } from './supabase'

export interface Post {
  id: string
  creator_id: string
  title: string
  body_md: string
  is_published: boolean
  published_at: string | null
  created_at: string
  requires_subscription: boolean
  images?: PostImage[]
}

export interface PostImage {
  id: string
  post_id: string
  storage_path: string
  sort_order: number
}

/**
 * Gets published posts for a creator with images
 * Optimized: Uses JOIN to fetch images in a single query
 * Premium posts (requires_subscription = true) are sorted first
 */
export async function getCreatorPosts(creatorId: string): Promise<Post[]> {
  const supabase = getSupabaseServiceRole()
  
  // Fetch posts with images in a single query using JOIN
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      post_images (
        id,
        post_id,
        storage_path,
        sort_order
      )
    `)
    .eq('creator_id', creatorId)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(50)
  
  if (error || !data) {
    return []
  }
  
  // Transform data: group images by post_id and sort them
  const postsMap = new Map<string, Post>()
  
  for (const row of data as any[]) {
    const postId = row.id
    
    if (!postsMap.has(postId)) {
      postsMap.set(postId, {
        ...row,
        images: []
      } as Post)
    }
    
    // Add images if they exist
    if (row.post_images && Array.isArray(row.post_images)) {
      const post = postsMap.get(postId)!
      post.images = row.post_images
        .map((img: any) => ({
          id: img.id,
          post_id: img.post_id,
          storage_path: img.storage_path,
          sort_order: img.sort_order
        }))
        .sort((a: PostImage, b: PostImage) => a.sort_order - b.sort_order)
    }
  }
  
  const postsWithImages = Array.from(postsMap.values())
  
  // Sort by published_at descending (already sorted by DB, but ensure consistency)
  const sortedByDate = postsWithImages.sort((a, b) => {
    const dateA = a.published_at ? new Date(a.published_at).getTime() : 0
    const dateB = b.published_at ? new Date(b.published_at).getTime() : 0
    return dateB - dateA
  })
  
  // Separate into free and premium posts
  const freePosts = sortedByDate.filter(post => !post.requires_subscription)
  const premiumPosts = sortedByDate.filter(post => post.requires_subscription)
  
  // Interleave: free, premium, free, premium, etc.
  const interleaved: Post[] = []
  const maxLength = Math.max(freePosts.length, premiumPosts.length)
  
  for (let i = 0; i < maxLength; i++) {
    if (i < freePosts.length) {
      interleaved.push(freePosts[i])
    }
    if (i < premiumPosts.length) {
      interleaved.push(premiumPosts[i])
    }
  }
  
  return interleaved.slice(0, 20) // Return top 20
}

/**
 * Gets images for a post
 */
export async function getPostImages(postId: string): Promise<PostImage[]> {
  const supabase = getSupabaseServiceRole()
  
  const { data, error } = await supabase
    .from('post_images')
    .select('*')
    .eq('post_id', postId)
    .order('sort_order', { ascending: true })
  
  if (error || !data) {
    return []
  }
  
  return data as PostImage[]
}

