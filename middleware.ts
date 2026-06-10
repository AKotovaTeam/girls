import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { resolveTenant, isAdminHost } from './lib/tenant'

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname
  
  // Admin routes - only accessible on admin host
  if (pathname.startsWith('/admin')) {
    if (!isAdminHost(host)) {
      return new NextResponse('Not Found', { status: 404 })
    }
    return NextResponse.next()
  }
  
  // Creator routes - must resolve to a valid creator
  // Skip auth callback and public routes
  const publicRoutes = ['/auth/callback', '/login', '/subscribe', '/']
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))
  
  if (!isPublicRoute) {
    const creator = await resolveTenant(host)
    if (!creator) {
      return new NextResponse('Not Found', { status: 404 })
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}


