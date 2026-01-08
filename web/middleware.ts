import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Some tooling/environments inject a relative stylesheet reference like `layout.css?v=...`.
  // This can happen at root level or on deep routes.
  // Rewrite those requests to the root-level compatibility shim at `/layout.css`.
  if (pathname.endsWith('/layout.css') || pathname === '/layout.css') {
    const url = request.nextUrl.clone()
    url.pathname = '/layout.css'
    return NextResponse.rewrite(url)
  }

  // Add pathname to headers for server components (OnboardingCardWrapper)
  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  return response
}

export const config = {
  // Match all routes except API, static files, and Next.js internals
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
}
