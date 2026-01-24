/**
 * NeuroBreath Buddy Query API Route
 * POST /api/buddy/query
 * 
 * Internal-first resolution with external fallback
 */

import { NextRequest, NextResponse } from 'next/server';
import { loadInternalIndex, searchInternalIndex } from '@/lib/buddy/kb/contentIndex';
import { buildNeuroBreathAnswer } from '@/lib/buddy/kb/answerTemplates';
import { InternalPageMetadata } from '@/lib/buddy/kb/types';
import { getQuickIntentByLabel } from '@/lib/buddy/kb/quickIntents';
import type { BuddyAnswerContext, BuddyQueryResult } from '@/lib/buddy/kb/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as BuddyAnswerContext;
    const { question, currentPath, region = 'uk', detectedSections = [] } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    const result = await queryBuddy(question, currentPath, region as 'uk' | 'us', detectedSections);
    const totalTime = Date.now() - startTime;

    // Add timing to debug
    if (result.debug) {
      result.debug.timingMs = {
        total: totalTime
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Buddy API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    );
  }
}

async function queryBuddy(
  question: string,
  currentPath?: string,
  region: 'uk' | 'us' = 'uk',
  _detectedSections: Array<{ id: string; title: string }> = []
): Promise<BuddyQueryResult> {
  // Step 1: Check if this is a quick intent button
  const quickIntent = getQuickIntentByLabel(question);

  if (quickIntent) {
    // Handle quick intents
    const index = await loadInternalIndex();
    const internalPages = quickIntent.primaryInternalPaths
      .map((path) => index.pages.find((p) => p.path === path))
      .filter((p) => p !== undefined) as InternalPageMetadata[];

    if (internalPages.length > 0) {
      return buildNeuroBreathAnswer(question, internalPages);
    }
  }

  // Step 2: Search internal index for the question
  const index = await loadInternalIndex();
  const internalSearchStart = Date.now();
  const internalMatches = searchInternalIndex(index, question, {
    limit: 5,
    region
  });
  const internalSearchMs = Date.now() - internalSearchStart;

  // Step 3: If internal coverage is sufficient, build answer from internal pages
  if (internalMatches.length > 0) {
    const result = buildNeuroBreathAnswer(question, internalMatches);
    result.debug = {
      internalMatches: internalMatches.length,
      externalSourcesUsed: [],
      timingMs: { total: internalSearchMs, internalSearchMs },
      provider: 'internal-index'
    };
    return result;
  }

  // Step 4: If no internal coverage, attempt external fallback
  // For now, return a graceful response that suggests internal exploration
  const relatedPages = index.pages.slice(0, 3);

  return {
    question,
    answerHtml: `
      <div class="buddy-answer">
        <div class="answer-section">
          <p>I'm still building comprehensive coverage for this question. Here are some related NeuroBreath resources that might help:</p>
          <ul class="answer-links">
            ${relatedPages
              .map((page) => `<li><a href="${page.path}" class="buddy-link">${page.title}</a></li>`)
              .join('')}
          </ul>
        </div>
        <div class="answer-section">
          <p>If you need specific support, please contact our team through the <a href="/contact">Contact page</a>.</p>
        </div>
      </div>
    `,
    internalLinks: relatedPages.map((page) => ({
      url: page.path,
      text: page.title,
      relevance: 0.5
    })),
    coverage: 'internal-only',
    debug: {
      internalMatches: internalMatches.length,
      externalSourcesUsed: [],
      timingMs: { total: internalSearchMs, internalSearchMs },
      provider: 'internal-index'
    }
  };
}
