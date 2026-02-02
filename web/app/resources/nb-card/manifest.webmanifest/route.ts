import type { MetadataRoute } from 'next'
import { NextResponse } from 'next/server'

import manifest from '../manifest'

type ManifestWithId = MetadataRoute.Manifest & { id: string }

export function GET() {
  const body = JSON.stringify(manifest() as ManifestWithId)

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
