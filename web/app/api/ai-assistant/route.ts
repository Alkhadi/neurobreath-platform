/**
 * Unified AI Assistant API Route
 * 
 * Consolidated endpoint for NeuroBreath Buddy, AI Coach, and Blog AI.
 * Uses unified AI core with evidence-based responses, safety checks, and citations.
 * 
 * Maintains backward compatibility with existing Buddy API while adding:
 * - Evidence citations (NHS, NICE, PubMed)
 * - Crisis signposting (999, NHS 111, 988, etc.)
 * - Educational disclaimers
 * - Unified user preferences
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  checkQuerySafety,
  generateEmergencyResponse,
  wrapAnswerWithSafety,
  sanitizeInput,
  validateResponseSafety,
} from '@/lib/ai/core/safety';
import {
  routeQuery,
  needsLLM,
  type QueryType,
} from '@/lib/ai/core/answerRouter';
import {
  generateBuddyPrompt,
  generateCoachPrompt,
  generateBlogPrompt,
} from '@/lib/ai/core/systemPrompts';
import {
  createNHSCitation,
  groupCitations,
  formatCitationGroup,
  type Citation,
} from '@/lib/ai/core/citations';

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
  // Core
  query?: string; // User question
  messages?: Message[]; // Chat history
  
  // Context
  role?: 'buddy' | 'coach' | 'blog';
  pageName?: string;
  pageContext?: {
    sections?: Array<{ name: string; description: string }>;
    features?: string[];
    headings?: Array<{ text: string; id: string; level: number }>;
  };
  
  // User context
  jurisdiction?: 'UK' | 'US' | 'EU';
  userRole?: 'parent' | 'teacher' | 'carer' | 'individual' | 'professional';
  topic?: string;
  
  // Legacy Buddy API compatibility
  systemPrompt?: string;
}

interface ResponsePayload {
  answer: string;
  recommendedActions?: RecommendedAction[];
  references?: Reference[];
  availableTools?: string[];
  citations?: string; // Formatted citation group
  routing?: string; // Debug info
  safety?: {
    level: string;
    signposting?: string;
  };
}

/**
 * Default NHS citations (fallback)
 */
const DEFAULT_NHS_CITATIONS: Citation[] = [
  createNHSCitation(
    'NHS: Breathing exercises for stress',
    'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/',
    '2024-01-01'
  ),
  createNHSCitation(
    'NHS Every Mind Matters',
    'https://www.nhs.uk/every-mind-matters/',
    '2024-01-01'
  ),
].filter((c): c is Citation => c !== null);

/**
 * POST /api/ai-assistant
 * 
 * Unified AI endpoint with evidence-based responses
 */
export async function POST(request: NextRequest) {
  try {
    const body: RequestPayload = await request.json();
    const {
      query: rawQuery,
      messages = [],
      role = 'buddy',
      pageName,
      pageContext,
      jurisdiction = 'UK',
      userRole,
      topic: _topic,
      systemPrompt: legacySystemPrompt,
    } = body;

    // Extract user query from messages or query field (prefer the most recent user message)
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content;
    const userQuery = rawQuery || lastUserMessage || '';

    // Validate input
    if (!userQuery.trim()) {
      return NextResponse.json(
        {
          error: 'Query is required',
          answer: 'Please ask me a question!',
          references: DEFAULT_NHS_CITATIONS.map(citationToReference),
        },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedQuery = sanitizeInput(userQuery);

    // Safety check first
    const safetyCheck = checkQuerySafety(sanitizedQuery, jurisdiction);

    // Emergency: return signposting only
    if (safetyCheck.action === 'escalate_only') {
      const emergencyResponse = generateEmergencyResponse(
        safetyCheck.level as 'emergency' | 'safeguarding',
        jurisdiction
      );

      return NextResponse.json({
        answer: emergencyResponse,
        safety: {
          level: safetyCheck.level,
          signposting: safetyCheck.signposting,
        },
        recommendedActions: [],
        references: [],
      });
    }

    // Route query to determine handling
    const routing = routeQuery(sanitizedQuery, {
      pagePath: pageName,
      jurisdiction,
      role,
    });

    // Generate system prompt (always start from unified prompts; append legacy prompt as additional context)
    let systemPrompt: string;
    if (role === 'buddy' && pageName && pageContext) {
      systemPrompt = generateBuddyPrompt(
        pageName,
        {
          sections: pageContext.sections || [],
          features: pageContext.features || [],
          quickQuestions: [],
        },
        routing.topic
      );
    } else if (role === 'coach') {
      systemPrompt = generateCoachPrompt(routing.topic || 'general', userRole, jurisdiction);
    } else if (role === 'blog') {
      systemPrompt = generateBlogPrompt(jurisdiction);
    } else {
      systemPrompt = `You are a helpful NeuroBreath AI assistant providing evidence-based neurodiversity support.`;
    }

    if (legacySystemPrompt) {
      systemPrompt = `${systemPrompt}\n\n---\n\nAdditional page/context instructions (client-provided):\n${legacySystemPrompt}`;
    }

    // Check if we need LLM or can use knowledge base
    const useLLM = needsLLM(routing);

    let answer: string;
    const citations: Citation[] = [...DEFAULT_NHS_CITATIONS];

    if (!useLLM) {
      // Use knowledge base or fallback
      answer = generateKnowledgeBaseAnswer(sanitizedQuery, routing.queryType, pageContext);
    } else {
      // Check API key
      if (!process.env.ABACUSAI_API_KEY) {
        console.warn('[AI Assistant] ABACUSAI_API_KEY not configured, degraded mode');

        const degradedAnswer = generateDegradedModeAnswer({
          query: sanitizedQuery,
          routing,
          role,
          pageName,
          pageContext,
          jurisdiction,
        });

        return NextResponse.json({
          answer: wrapAnswerWithSafety(degradedAnswer, safetyCheck, jurisdiction),
          recommendedActions: generateRecommendedActions(routing.queryType, role, pageContext),
          references: DEFAULT_NHS_CITATIONS.map(citationToReference),
        });
      }

      // Call LLM
      const fullMessages: Message[] = [
        { role: 'system', content: systemPrompt },
        ...messages.filter((m) => m.role !== 'system'), // Remove duplicate system messages
        { role: 'user', content: sanitizedQuery },
      ];

      try {
        const llmResponse = await fetch('https://apps.abacus.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.ABACUSAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4.1-mini',
            messages: fullMessages,
            stream: false,
            max_tokens: 800,
            temperature: 0.4,
          }),
          signal: AbortSignal.timeout(30000),
        });

        if (!llmResponse.ok) {
          throw new Error(`LLM API error: ${llmResponse.status}`);
        }

        const data = await llmResponse.json();
        answer = data.choices?.[0]?.message?.content || 'I apologize, I had trouble generating a response.';
      } catch (error) {
        console.error('[AI Assistant] LLM error:', error);
        answer =
          "I'm having trouble connecting right now. In the meantime, try the Quick Questions or page tour!";
      }
    }

    // Wrap answer with safety (crisis signposting + disclaimer)
    const safeAnswer = wrapAnswerWithSafety(answer, safetyCheck, jurisdiction);

    // Validate response safety
    const validation = validateResponseSafety(safeAnswer);
    if (!validation.safe) {
      console.warn('[AI Assistant] Safety validation warnings:', validation.warnings);
    }

    // Format citations
    const citationGroup = groupCitations(citations);
    const formattedCitations = formatCitationGroup(citationGroup);

    // Generate recommended actions based on routing
    const recommendedActions = generateRecommendedActions(routing.queryType, role, pageContext);

    // Build response
    const response: ResponsePayload = {
      answer: safeAnswer,
      recommendedActions,
      references: citations.map(citationToReference),
      citations: formattedCitations,
      safety: {
        level: safetyCheck.level,
        signposting: safetyCheck.signposting,
      },
    };

    // Add debug info in development
    if (process.env.NODE_ENV === 'development') {
      response.routing = `Type: ${routing.queryType} | Topic: ${routing.topic} | Priority: ${routing.priority}`;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('[AI Assistant] Fatal error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        answer:
          "I apologize for the interruption! Please try asking your question again in a moment.\n\nIn the meantime, you can browse the page sections or try the Quick Questions.",
        recommendedActions: [
          {
            id: 'refresh',
            type: 'navigate',
            label: 'Refresh Page',
            icon: 'sparkles',
            target: typeof window !== 'undefined' ? window.location.href : '/',
          },
        ],
        references: DEFAULT_NHS_CITATIONS.map(citationToReference),
      },
      { status: 200 }
    );
  }
}

/**
 * Generate knowledge base answer (no LLM)
 */
function generateKnowledgeBaseAnswer(query: string, queryType: QueryType, _pageContext?: Record<string, unknown>): string {
  if (queryType === 'navigation') {
    return "I can help you navigate! What section would you like to go to? Try asking 'show me breathing exercises' or 'take me to the ADHD hub'.";
  }

  if (queryType === 'tool_help') {
    return "I can guide you through any tool on this page. What do you need help with?";
  }

  return "I'm here to help! Could you tell me more about what you're looking for?";
}

function generateDegradedModeAnswer(params: {
  query: string;
  routing: { queryType: QueryType; topic?: string };
  role: RequestPayload['role'];
  pageName?: string;
  pageContext?: RequestPayload['pageContext'];
  jurisdiction: RequestPayload['jurisdiction'];
}): string {
  const { query, routing, pageName, pageContext, jurisdiction } = params;

  const contextLine = pageName ? ` on **${pageName}**` : '';
  const opener = `I'm currently running in **limited mode** (the full AI service isn't configured), but I can still help with your question${contextLine}.\n\n**Your question:** ${query}`;

  if (routing.queryType === 'navigation') {
    const headings = pageContext?.headings || [];
    const sections = pageContext?.sections || [];
    const lower = query.toLowerCase();

    const bestHeading = headings.find((h) => h.text.toLowerCase().split(/\s+/).some((w) => w.length > 3 && lower.includes(w)));
    const bestSection = sections.find((s) => s.name.toLowerCase().split(/\s+/).some((w) => w.length > 3 && lower.includes(w)));

    const suggestions: string[] = [];
    if (bestHeading) suggestions.push(`- Try the section: **${bestHeading.text}**`);
    if (bestSection) suggestions.push(`- Look for: **${bestSection.name}**`);
    if (!suggestions.length && sections.length) {
      suggestions.push(`- This page has sections like: ${sections.slice(0, 4).map((s) => `**${s.name}**`).join(', ')}`);
    }

    return `${opener}\n\n**Best next step:**\n${suggestions.join('\n') || '- Tell me what you want to find (e.g., “breathing”, “quests”, “skills”).'}`;
  }

  if (routing.queryType === 'tool_help') {
    const features = pageContext?.features || [];
    return `${opener}\n\nI can help you use tools on this page.\n\n**What tool are you trying to use?**${features.length ? `\n- Available here: ${features.map((f) => `**${f}**`).join(', ')}` : ''}`;
  }

  if (routing.queryType === 'health_evidence') {
    const crisisLine = jurisdiction === 'UK'
      ? 'If you feel in immediate danger or at risk of self-harm, call **999** (or **NHS 111** for urgent advice).'
      : jurisdiction === 'US'
        ? 'If you feel in immediate danger or at risk of self-harm, call **911** (or **988** for crisis support).'
        : 'If you feel in immediate danger or at risk of self-harm, call your local emergency number (EU: **112**).';

    return `${opener}\n\nI can't pull a fully tailored evidence summary right now, but here are safe, practical next steps you can try today:\n\n- **Name the goal** (e.g., focus, calm, sleep, overwhelm) and what “better” looks like\n- **Try one small strategy for 5 minutes** (breathing, timer, checklist, break)\n- **Tell me your age group + situation** (child/teen/adult; school/work/home) and I’ll narrow it down\n\n${crisisLine}`;
  }

  // general_info
  return `${opener}\n\nCould you share one detail so I can answer more precisely (e.g., your goal, your age group, and where you're stuck)?`;
}

/**
 * Generate recommended actions based on context
 */
function generateRecommendedActions(
  queryType: QueryType,
  role: string,
  _pageContext?: Record<string, unknown>
): RecommendedAction[] {
  const actions: RecommendedAction[] = [];

  if (queryType === 'health_evidence') {
    actions.push({
      id: 'breathing',
      type: 'navigate',
      label: 'Breathing Exercises',
      description: 'Try a calming technique',
      icon: 'heart',
      target: '/breathing',
      primary: true,
    });
  }

  if (role === 'buddy') {
    actions.push({
      id: 'tour',
      type: 'scroll',
      label: 'Page Tour',
      description: 'Get a guided walkthrough',
      icon: 'map',
      target: '#',
    });
  }

  return actions;
}

/**
 * Get default recommended actions
 */
/**
 * Convert Citation to Reference format (backward compatibility)
 */
function citationToReference(citation: Citation): Reference {
  return {
    title: citation.title,
    url: citation.url,
    sourceLabel: citation.sourceLabel,
    updatedAt: citation.updatedAt,
    isExternal: citation.isExternal,
  };
}
