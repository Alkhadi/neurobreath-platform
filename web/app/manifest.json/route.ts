import { NextResponse } from 'next/server';

import manifest from '../manifest';

export async function GET() {
  const data = await manifest();

  return NextResponse.json(data, {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
    },
  });
}
