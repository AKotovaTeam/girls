import { getSupabaseServiceRole } from './supabase'

export interface MessageImage {
  id: string
  message_id: string
  storage_path: string
  sort_order: number
  price_credits: number | null
  created_at: string
}

/**
 * Gets images for a message
 */
export async function getMessageImages(messageId: string): Promise<MessageImage[]> {
  const supabase = getSupabaseServiceRole()
  
  const { data, error } = await supabase
    .from('message_images')
    .select('*')
    .eq('message_id', messageId)
    .order('sort_order', { ascending: true })
  
  if (error || !data) {
    return []
  }
  
  return data as MessageImage[]
}

/**
 * Creates a signed URL for a message image (TTL 10 minutes)
 * For MVP: if path starts with /, treat as public path and return as-is
 * For production: create signed URL from Supabase Storage
 */
export async function getMessageImageSignedUrl(storagePath: string): Promise<string | null> {
  // For MVP: if path starts with /, it's a public file
  if (storagePath.startsWith('/')) {
    return storagePath
  }
  
  // For production: create signed URL from Supabase Storage
  const supabase = getSupabaseServiceRole()
  
  try {
    // Extract bucket and file path from storage_path
    // Format: bucket/path/to/file.jpg or just path/to/file.jpg
    const pathParts = storagePath.split('/')
    const bucket = pathParts[0] || 'private'
    const filePath = pathParts.slice(1).join('/')
    
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(filePath, 600) // 10 minutes = 600 seconds
    
    if (error || !data) {
      console.error('Error creating signed URL:', error)
      return null
    }
    
    return data.signedUrl
  } catch (error) {
    console.error('Error creating signed URL:', error)
    return null
  }
}

/**
 * Checks if user has purchased access to a message image
 */
export async function hasPurchasedImage(
  accountId: string,
  messageImageId: string
): Promise<boolean> {
  const supabase = getSupabaseServiceRole()
  
  const { data, error } = await supabase
    .from('purchased_message_images')
    .select('id')
    .eq('account_id', accountId)
    .eq('message_image_id', messageImageId)
    .single()
  
  return !error && !!data
}

