import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const REGION_COOKIE = 'nb_region'
const EXCLUDED_PREFIXES = ['/api', '/_next', '/favicon', '/robots', '/sitemap', '/assets', '/images']
const REGION_LOCALISED_PREFIXES = ['/', '/trust', '/help-me-choose', '/glossary', '/printables', '/journeys', '/about', '/editorial']

const AUTH_PROTECTED_PATHS = ['/uk/my-account', '/uk/change-password']

const isExcluded = (pathname: string) =>
  EXCLUDED_PREFIXES.some(prefix => pathname.startsWith(prefix))

const detectRegion = (request: NextRequest): 'uk' | 'us' => {
  const cookieRegion = request.cookies.get(REGION_COOKIE)?.value?.toLowerCase()
  if (cookieRegion === 'us' || cookieRegion === 'uk') return cookieRegion

  const vercelCountry = request.headers.get('x-vercel-ip-country')?.toUpperCase()
  const cfCountry = request.headers.get('cf-ipcountry')?.toUpperCase()
  const country = vercelCountry || cfCountry
  if (country === 'US') return 'us'

  return 'uk'
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Optional auth protection (keep the rest of the site public)
  if (AUTH_PROTECTED_PATHS.some(p => pathname === p || pathname.startsWith(`${p}/`))) {
    const secret = process.env.NEXTAUTH_SECRET
    if (!secret) {
      const url = request.nextUrl.clone()
      url.pathname = '/uk/login'
      url.searchParams.set('error', 'AUTH_CONFIG')
      return NextResponse.redirect(url)
    }

    const token = await getToken({ req: request, secret })
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/uk/login'
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }

  // Next.js serves the metadata manifest at `/manifest.webmanifest`.
  // Ensure `/manifest.json` (and any locale-prefixed variants) resolve to the manifest
  // instead of being captured by the dynamic `[region]` route.
  if (pathname === '/manifest.json' || pathname === '/uk/manifest.json' || pathname === '/us/manifest.json') {
    const url = request.nextUrl.clone()
    url.pathname = '/manifest.webmanifest'
    return NextResponse.rewrite(url)
  }

  // Some tooling/environments inject a relative stylesheet reference like `layout.css?v=...`.
  // This can happen at root level or on deep routes.
  // Rewrite those requests to the root-level compatibility shim at `/layout.css`.
  if (pathname.endsWith('/layout.css') || pathname === '/layout.css') {
    const url = request.nextUrl.clone()
    url.pathname = '/layout.css'
    return NextResponse.rewrite(url)
  }

  if (!isExcluded(pathname) && !pathname.startsWith('/uk') && !pathname.startsWith('/us')) {
    const shouldLocalize = REGION_LOCALISED_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))
    if (shouldLocalize) {
      const region = detectRegion(request)
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = `/${region}${pathname === '/' ? '' : pathname}`
      const response = NextResponse.redirect(redirectUrl)
      response.headers.set('Vary', 'Accept-Language, Cookie')
      return response
    }
  }

  // Make the current pathname available to server components via request headers.
  // `next/headers` reads *request* headers (not response headers), so we must
  // override the request headers on the way into the route.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  // Match all routes except API, static files, and Next.js internals
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
}
