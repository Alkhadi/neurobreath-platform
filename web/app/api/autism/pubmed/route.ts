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
    console.error('PubMed API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PubMed results' },
      { status: 500 }
    )
  }
}

