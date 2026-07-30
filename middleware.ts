import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Real, crawlable Arabic routing: requests to /ar or /ar/* are rewritten
// internally to the equivalent unprefixed route (Next's page/route files are
// not duplicated per-locale — see lib/locale.ts), while the browser's URL
// bar keeps showing /ar/*. An `x-locale` request header (read via
// next/headers in Server Components — see lib/locale.ts) tells each page
// and the root layout which language to render. English stays unprefixed
// as the default locale so none of the site's existing URLs change.
const LOCALE_PREFIX = '/ar'

function isAdminOrAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    /\.[a-zA-Z0-9]+$/.test(pathname) // static files (images, fonts, etc.)
  )
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    // Note: this matcher excludes /api/* entirely (see `config.matcher` below),
    // so this handler only ever runs for page routes. CORS is handled per-route
    // inside the relevant app/api/**/route.ts files instead.

    let response: NextResponse
    let locale: 'en' | 'ar' = 'en'

    if (!isAdminOrAsset(pathname) && (pathname === LOCALE_PREFIX || pathname.startsWith(`${LOCALE_PREFIX}/`))) {
      locale = 'ar'
      const rewrittenPath = pathname.slice(LOCALE_PREFIX.length) || '/'
      const url = req.nextUrl.clone()
      url.pathname = rewrittenPath
      response = NextResponse.rewrite(url)
    } else {
      response = NextResponse.next()
    }

    response.headers.set('x-locale', locale)
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