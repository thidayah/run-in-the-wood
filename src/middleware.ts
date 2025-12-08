import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-32-character-secret-key-change-in-production-min-32-chars'
)

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const path = request.nextUrl.pathname
  
  // Public paths that don't require auth
  const publicPaths = [
    '/',
    '/events',
    '/participants',
    '/registration',
    '/order',
    '/admin/login',
    '/api/auth',
    '/api/events',
    '/api/participants'
  ]
  
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(`${publicPath}/`)
  )
  
  // Allow public paths (except admin paths)
  if (isPublicPath && !path.startsWith('/admin/')) {
    return NextResponse.next()
  }
  
  // Check if path is admin protected
  const isAdminPath = path.startsWith('/admin')
  
  if (isAdminPath) {
    // Skip login page
    if (path === '/admin/login') {
      // If logged, redirect to dashboard
      if (token) {
        try {
          await jwtVerify(token, JWT_SECRET)
          return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        } catch {
          // Token invalid, stay login page
          return NextResponse.next()
        }
      }
      return NextResponse.next()
    }
    
    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    try {
      // Verify token with jose (Edge compatible)
      const { payload } = await jwtVerify(token, JWT_SECRET)
      
      // Add user info to headers for API routes
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.id as string)
      requestHeaders.set('x-user-email', payload.email as string)
      requestHeaders.set('x-user-role', payload.role as string)
      requestHeaders.set('x-user-name', payload.name as string)
      
      return NextResponse.next({
        request: {
          headers: requestHeaders
        }
      })
      
    } catch (error) {
      console.error('JWT verification error:', error)
      
      // Invalid token, redirect to login dengan clear cookies
      const response = NextResponse.redirect(
        new URL(`/admin/login?error=Session expired`, request.url)
      )
      
      // Clear invalid cookies
      response.cookies.delete('auth_token')
      response.cookies.delete('user_session')
      
      return response
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth (auth endpoints)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}