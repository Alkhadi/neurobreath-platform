import { NextRequest, NextResponse } from 'next/server';
import { searchPubMed } from '@/lib/ai-coach/pubmed';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 30; // Allow up to 30 seconds for PubMed API

interface PubMedArticle {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  year: string;
  abstract: string;
  doi?: string;
  url: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const maxStr = searchParams.get('max');
    const yearFromStr = searchParams.get('yearFrom');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter required' },
        { status: 400 }
      );
    }

    const max = maxStr ? parseInt(maxStr, 10) : 10;
    const yearFrom = yearFromStr || '2020';

    // Build query with year filter
    const yearFilteredQuery = `${query} AND ${yearFrom}:3000[dp]`;

    // Use existing PubMed utility (now includes fallback handling)
    const rawArticles = await searchPubMed(yearFilteredQuery, max);

    // Transform to expected format
    const articles: PubMedArticle[] = rawArticles.map((article) => ({
      pmid: article.pmid,
      title: article.title,
      authors: article.authors || [],
      journal: article.journal || '',
      year: article.year || '',
      abstract: article.abstract || '',
      doi: undefined,
      url: article.url || `https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`,
    }));

    // Always return 200 with articles (may be from fallback)
    return NextResponse.json({
      articles,
      total: articles.length,
      query,
      yearFrom,
      source: articles.length > 0 ? 'success' : 'fallback',
    });
  } catch (error) {
    console.error('[PubMed API] Error:', error);

    // Return 200 with fallback message instead of 500
    // The searchPubMed function now returns fallback articles, so this catch
    // is for truly unexpected errors
    return NextResponse.json({
      articles: [],
      total: 0,
      query: request.nextUrl.searchParams.get('query') || '',
      yearFrom: request.nextUrl.searchParams.get('yearFrom') || '2020',
      source: 'error',
      message: 'Research database temporarily unavailable. Please try again.',
    });
  }
}
