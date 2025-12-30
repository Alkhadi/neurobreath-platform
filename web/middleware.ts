import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Some tooling/environments inject a relative stylesheet reference like `layout.css?v=...`.
  // On deep routes that becomes `/<route>/layout.css?...` which 404s.
  // Rewrite those requests to the root-level compatibility shim at `/layout.css`.
  if (pathname.endsWith('/layout.css')) {
    const url = request.nextUrl.clone()
    url.pathname = '/layout.css'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next).*)/layout.css'],
}
