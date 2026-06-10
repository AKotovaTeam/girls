import { getSupabaseServiceRole } from './supabase'

/**
 * Attaches photos to a message when Jane mentions photos
 * Returns array of photo paths to attach
 */
export async function attachPhotosToMessage(
  messageBody: string,
  creatorId: string
): Promise<string[]> {
  // Check if message mentions photos
  const photoKeywords = [
    'photo',
    'picture',
    'pic',
    'image',
    'set',
    'special',
    'exclusive',
    'share',
    'show',
    'send',
    'link',
    'content',
    'unlock',
    'access',
    'upload',
    'uploaded',
    'uploads',
    'see',
    'view',
    'look',
    'check',
    'saving',
    'saved',
    'one',
    'last',
  ]
  
  const lowerBody = messageBody.toLowerCase()
  
  // Check for multiple indicators that suggest photo sharing
  const hasPhotoKeyword = photoKeywords.some(keyword => lowerBody.includes(keyword))
  const hasUploadIndicator = lowerBody.includes('upload') || lowerBody.includes('*upload')
  const hasPhotoContext = (lowerBody.includes('photo') || lowerBody.includes('picture') || lowerBody.includes('pic')) && 
                         (lowerBody.includes('special') || lowerBody.includes('exclusive') || lowerBody.includes('saving'))
  
  const mentionsPhoto = hasPhotoKeyword || hasUploadIndicator || hasPhotoContext
  
  // Debug logging
  console.log('[attach-photos] Checking message:', messageBody.substring(0, 150))
  console.log('[attach-photos] Has photo keyword:', hasPhotoKeyword)
  console.log('[attach-photos] Has upload indicator:', hasUploadIndicator)
  console.log('[attach-photos] Has photo context:', hasPhotoContext)
  console.log('[attach-photos] Mentions photo:', mentionsPhoto)
  
  if (!mentionsPhoto) {
    return []
  }
  
  // For MVP, use photos from public/jane-casual folder
  // In production, these would be in Supabase Storage
  const availablePhotos = [
    '/jane-casual/388c30d7f7491dd78ca45be581c74a3500bcef6b2e7d851f627a49472d091ce86398fbd0.jpg',
    '/jane-casual/28fc39fc248b1bdefb2f2c379afd62fd7e4edda52bdd7639f6eda287d3594e2ea6014376.jpg',
    '/jane-casual/98513f07966314d8cc8ed74c0f005b2624f89ee3223d73b5c25daae75ae937e2dfe2225d.jpg',
    '/jane-casual/68a431cefde21fd2276ccde1ac71cf5f099255022e9da17bd185ab570ba94af86b6dbdaa.jpg',
    '/jane-casual/68e233e5097a1ed50e4a52ed83d4bd8eabe9eac6267d90a024ec267a8c8916db31050e96.jpg',
    '/jane-casual/08903f6eecb019d4a500e3f932eff54fdd2ce6272efdba8c9190699a88097ea6ea106802.jpg',
  ]
  
  // Randomly select 1 photo
  const randomIndex = Math.floor(Math.random() * availablePhotos.length)
  const selectedPhoto = availablePhotos[randomIndex]
  
  console.log('[attach-photos] Selected photo:', selectedPhoto)
  
  return [selectedPhoto] // Return array with single photo
}

/**
 * Saves message images to database
 */
export async function saveMessageImages(
  messageId: string,
  photoPaths: string[],
  priceCredits: number | null = null
): Promise<void> {
  if (photoPaths.length === 0) {
    return
  }
  
  const supabase = getSupabaseServiceRole()
  
  const imagesToInsert = photoPaths.map((path, index) => ({
    message_id: messageId,
    storage_path: path,
    sort_order: index,
    price_credits: priceCredits,
  }))
  
  const { data, error } = await supabase
    .from('message_images')
    .insert(imagesToInsert)
    .select()
  
  if (error) {
    console.error('[saveMessageImages] Error saving message images:', error)
  } else {
    console.log('[saveMessageImages] Successfully saved', imagesToInsert.length, 'images for message', messageId)
  }
}

