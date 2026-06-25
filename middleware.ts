import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Add CORS headers for API routes
    if (req.nextUrl.pathname.startsWith('/api/')) {
      const response = NextResponse.next()
      
      // Add CORS headers
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      
      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: response.headers })
      }
      
      return response
    }
    
    // Add security headers
    const response = NextResponse.next()
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
    
    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to admin login page without authentication
        if (req.nextUrl.pathname.startsWith('/admin/login')) {
          return true
        }
        
        // For all other admin routes, let React Admin handle authentication
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return true
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    // Match all paths except api routes, static files, and images
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}