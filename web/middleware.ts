import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const DEVICE_ID_COOKIE = 'nb_device_id'
const DEVICE_ID_MAX_AGE_SECONDS = 60 * 60 * 24 * 400 // ~400 days

const REGION_COOKIE = 'nb_region'
const EXCLUDED_PREFIXES = [
  '/api',
  '/_next',
  '/assets',
  '/images',
  '/icons',
  '/nbcard-sw.js',
  // Root static files that must never be locale-redirected.
  '/favicon',
  '/robots',
  '/sitemap',
  '/manifest.webmanifest',
  '/sw.js',
  '/nbcard-sw',
  '/icon-',
  '/apple-icon',
]

// NOTE: `/resources/*` is intentionally excluded from locale canonicalisation.
// NB-Card must remain a single canonical app under `/resources/nb-card`.
const REGION_LOCALISED_PREFIXES = [
  '/',
  '/trust',
  '/help-me-choose',
  '/glossary',
  '/printables',
  '/journeys',
  '/about',
  '/editorial',
  // Auth routes (support non-region canonical paths)
  '/login',
  '/register',
  '/my-account',
  '/change-password',
  '/password-reset',
]

const AUTH_PROTECTED_PATHS = ['/uk/my-account', '/uk/change-password', '/us/my-account', '/us/change-password']

const isExcluded = (pathname: string) =>
  EXCLUDED_PREFIXES.some(prefix => pathname.startsWith(prefix))

const detectRegion = (request: NextRequest): 'uk' | 'us' => {
  const cookieRegion = request.cookies.get(REGION_COOKIE)?.value?.toLowerCase()
  if (cookieRegion === 'us' || cookieRegion === 'uk') return cookieRegion

  // UK is the global default unless the user explicitly chose US.
  return 'uk'
}

function generateUuid(): string {
  const anyCrypto = globalThis.crypto as { randomUUID?: () => string } | undefined
  if (anyCrypto?.randomUUID) return anyCrypto.randomUUID()
  return `nb_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

function ensureDeviceIdCookie(request: NextRequest, response: NextResponse) {
  const existing = request.cookies.get(DEVICE_ID_COOKIE)?.value
  if (existing) return

  response.cookies.set({
    name: DEVICE_ID_COOKIE,
    value: generateUuid(),
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: DEVICE_ID_MAX_AGE_SECONDS,
  })
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Canonicalize condition detail pages: they are global routes (no region prefix).
  // Prevent 404s like `/uk/conditions/autism` by redirecting to `/conditions/autism`.
  if (/^\/(uk|us)\/conditions\/.+/.test(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/(uk|us)/, '')
    const res = NextResponse.redirect(url, 308)
    ensureDeviceIdCookie(request, res)
    return res
  }

  // Redirect known legacy page links that were historically served under `/legacy-assets/`.
  // Important: do NOT touch real legacy static assets under `/legacy-assets/assets/*`.
  if (pathname.startsWith('/legacy-assets/') && !pathname.startsWith('/legacy-assets/assets/')) {
    const url = request.nextUrl.clone()

    const legacyPage = pathname.replace(/^\/legacy-assets\//, '')
    const normalized = legacyPage.replace(/\.html$/i, '')

    const legacyMap: Record<string, string> = {
      'adhd-tools': '/tools/adhd-tools',
      'anxiety-tools': '/tools/anxiety-tools',
      'autism-tools': '/tools/autism-tools',
      'breath-tools': '/tools/breath-tools',
      'depression-tools': '/tools/depression-tools',
      'mood-tools': '/tools/mood-tools',
      'sleep-tools': '/tools/sleep-tools',
      'stress-tools': '/tools/stress-tools',
      'focus': '/tools/focus-training',
      'coherent-5-5': '/techniques/coherent',
      'box-breathing': '/techniques/box-breathing',
      'sos-60': '/techniques/sos',
      'downloads': '/downloads',
    }

    const target = legacyMap[normalized]
    if (target) {
      url.pathname = target
      const res = NextResponse.redirect(url, 308)
      ensureDeviceIdCookie(request, res)
      return res
    }
  }

  // Optional auth protection (keep the rest of the site public)
  if (AUTH_PROTECTED_PATHS.some(p => pathname === p || pathname.startsWith(`${p}/`))) {
    const loginPath = pathname.startsWith('/us') ? '/us/login' : '/uk/login'
    const secret = process.env.NEXTAUTH_SECRET
    if (!secret) {
      const url = request.nextUrl.clone()
      url.pathname = loginPath
      url.searchParams.set('error', 'AUTH_CONFIG')
      const res = NextResponse.redirect(url)
      ensureDeviceIdCookie(request, res)
      return res
    }

    const token = await getToken({ req: request, secret })
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = loginPath
      url.searchParams.set('callbackUrl', pathname)
      const res = NextResponse.redirect(url)
      ensureDeviceIdCookie(request, res)
      return res
    }
  }

  // Next.js serves the metadata manifest at `/manifest.webmanifest`.
  // Ensure `/manifest.json` (and any locale-prefixed variants) resolve to the manifest
  // instead of being captured by the dynamic `[region]` route.
  if (pathname === '/manifest.json' || pathname === '/uk/manifest.json' || pathname === '/us/manifest.json') {
    const url = request.nextUrl.clone()
    url.pathname = '/manifest.webmanifest'
    const res = NextResponse.rewrite(url)
    ensureDeviceIdCookie(request, res)
    return res
  }

  // Some tooling/environments inject a relative stylesheet reference like `layout.css?v=...`.
  // This can happen at root level or on deep routes.
  // Rewrite those requests to the root-level compatibility shim at `/layout.css`.
  if (pathname.endsWith('/layout.css') || pathname === '/layout.css') {
    const url = request.nextUrl.clone()
    url.pathname = '/layout.css'
    const res = NextResponse.rewrite(url)
    ensureDeviceIdCookie(request, res)
    return res
  }

  // Canonicalize region-prefixed NB-Card routes to the single installable app URL.
  // This must run before the locale routing redirect to avoid scope/identity capture.
  if (/^\/(uk|us)\/resources\/nb-card(\/|$)/.test(pathname)) {
    const remainder = pathname.replace(/^\/(uk|us)\/resources\/nb-card/, '')
    const canonicalPath = `/resources/nb-card${remainder}`
    const url = request.nextUrl.clone()
    url.pathname = canonicalPath
    const res = NextResponse.redirect(url, 307)
    ensureDeviceIdCookie(request, res)
    return res
  }

  if (!isExcluded(pathname) && !pathname.startsWith('/uk') && !pathname.startsWith('/us')) {
    const isConditionDetail = pathname.startsWith('/conditions/')
    const shouldLocalize =
      !isConditionDetail &&
      REGION_LOCALISED_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))
    if (shouldLocalize) {
      const region = detectRegion(request)
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = `/${region}${pathname === '/' ? '' : pathname}`
      const response = NextResponse.redirect(redirectUrl)
      response.headers.set('Vary', 'Accept-Language, Cookie')
      ensureDeviceIdCookie(request, response)
      return response
    }
  }

  // Make the current pathname available to server components via request headers.
  // `next/headers` reads *request* headers (not response headers), so we must
  // override the request headers on the way into the route.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)
  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  ensureDeviceIdCookie(request, res)
  return res
}

export const config = {
  // Match all routes except API, static files, and Next.js internals
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
}
