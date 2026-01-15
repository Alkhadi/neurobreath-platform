import { NextRequest, NextResponse } from 'next/server';
import { searchPubMed } from '@/lib/ai-coach/pubmed';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    // Use existing PubMed utility
    const rawArticles = await searchPubMed(yearFilteredQuery, max);

    // Transform to expected format
    const articles: PubMedArticle[] = rawArticles.map((article) => ({
      pmid: article.pmid,
      title: article.title,
      authors: article.authors || [],
      journal: article.journal || '',
      year: article.year || '',
      abstract: article.abstract || '',
      doi: undefined, // DOI not currently in our PubMed data
      url: article.url || `https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`,
    }));

    return NextResponse.json({
      articles,
      total: articles.length,
      query,
      yearFrom,
    });
  } catch (error) {
    console.error('[PubMed API] Error:', error);
    
    // Return 200 with empty array instead of 500 to prevent console errors
    // PubMed API failures are expected (CORS, rate limits, network issues)
    return NextResponse.json({
      articles: [],
      total: 0,
      error: 'PubMed service temporarily unavailable',
      fallback: true,
    });
  }
}
