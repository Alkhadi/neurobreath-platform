import { NextRequest, NextResponse } from 'next/server';
import { buddyAsk } from '@/lib/buddy/server/ask';
import type { BuddyAskResponse } from '@/lib/buddy/server/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface RecommendedAction {
  id: string;
  type: 'navigate' | 'scroll' | 'start_exercise' | 'open_tool' | 'download';
  label: string;
  description?: string;
  icon?: 'target' | 'play' | 'book' | 'timer' | 'file' | 'heart' | 'brain' | 'sparkles' | 'map';
  target?: string;
  primary?: boolean;
}

interface Reference {
  title: string;
  url: string;
  sourceLabel?: string;
  updatedAt?: string;
  isExternal: boolean;
}

interface RequestPayload {
  // Preferred "Buddy" shape
  question?: string;
  pathname?: string;
  locale?: string;

  // Back-compat with unified assistant payload
  query?: string;
  messages?: Message[];
  jurisdiction?: 'UK' | 'US' | 'EU';
}

interface ResponsePayload {
  answer: string;
  recommendedActions: RecommendedAction[];
  references: Reference[];
  citations?: string;
  safety?: {
    level: string;
    signposting?: string;
  };
}

function toLegacyResponse(result: BuddyAskResponse): ResponsePayload {
  const refs: Reference[] = (result.citations || []).map((s) => ({
    title: s.title,
    url: s.url,
    sourceLabel: s.provider,
    updatedAt: s.lastReviewed,
    isExternal: s.provider !== 'NeuroBreath',
  }));

  const answerText = [
    `**${result.answer.title}**`,
    result.answer.summary,
    ...result.answer.sections.map((s) => `\n\n**${s.heading}**\n${s.text}`),
    result.answer.safety.message ? `\n\n${result.answer.safety.message}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')
    .trim();

  return {
    answer: answerText,
    recommendedActions: [],
    references: refs,
    citations: '',
    safety: {
      level: result.answer.safety.level,
      signposting: result.answer.safety.message,
    },
  };
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as RequestPayload | null;

  const rawQuestion = String(body?.question || body?.query || '').trim();
  const pathname = String(body?.pathname || '/');
  const jurisdiction: 'UK' | 'US' | 'EU' = body?.jurisdiction || 'UK';

  if (!rawQuestion) {
    return NextResponse.json(
      { error: 'Missing question' },
      { status: 400 }
    );
  }

  const result = await buddyAsk(req, { question: rawQuestion, pathname, jurisdiction });
  return NextResponse.json(toLegacyResponse(result));
}
