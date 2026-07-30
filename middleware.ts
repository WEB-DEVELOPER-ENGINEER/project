import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Note: this matcher excludes /api/* entirely (see `config.matcher` below),
    // so this handler only ever runs for page routes. CORS is handled per-route
    // inside the relevant app/api/**/route.ts files instead.
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