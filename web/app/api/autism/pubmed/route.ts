import { NextRequest, NextResponse } from 'next/server'
import { searchPubMed, buildPubMedQuery } from '@/lib/ai-coach/pubmed'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
    }

    // Use existing PubMed utility
    const articles = await searchPubMed(query, 8)

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('[PubMed API] Error:', error)
    // Return 200 with empty array instead of 500 to prevent console errors
    // PubMed API failures are expected (CORS, rate limits, network issues)
    return NextResponse.json({
      articles: [],
      error: 'PubMed service temporarily unavailable',
      fallback: true
    })
  }
}

