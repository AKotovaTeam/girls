import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getCurrentAccount } from '@/lib/auth'
import { getTenantFromHost } from '@/lib/tenant'
import { getMessageImages, getMessageImageSignedUrl, hasPurchasedImage } from '@/lib/message-images'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const host = (await headers()).get('host') || ''
    const creator = await getTenantFromHost(host)
    
    if (!creator) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      )
    }
    
    const account = await getCurrentAccount()
    
    if (!account) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    if (account.creator_id !== creator.id) {
      return NextResponse.json(
        { error: 'Invalid account' },
        { status: 403 }
      )
    }
    
    const { conversationId } = await params
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('messageId')
    
    if (!messageId) {
      return NextResponse.json(
        { error: 'messageId is required' },
        { status: 400 }
      )
    }
    
    // Get images for the message
    const images = await getMessageImages(messageId)
    
    // Get signed URLs and check purchase status
    const imagesWithUrls = await Promise.all(
      images.map(async (image) => {
        // If image is free or user has purchased it, get signed URL
        const isFree = image.price_credits === null || image.price_credits === 0
        const hasPurchased = !isFree && await hasPurchasedImage(account.id, image.id)
        
        let signedUrl: string | null = null
        if (isFree || hasPurchased) {
          signedUrl = await getMessageImageSignedUrl(image.storage_path)
        }
        
        return {
          ...image,
          signedUrl,
          isFree,
          hasPurchased,
          canView: isFree || hasPurchased,
        }
      })
    )
    
    return NextResponse.json({
      images: imagesWithUrls,
    })
  } catch (error) {
    console.error('Get message images error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}


