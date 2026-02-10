import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface RecommendedAction {
  id: string;
  type: 'navigate' | 'scroll' | 'start_exercise' | 'open_tool' | 'download';
  label: string;
  description?: string;
  icon?: 'target' | 'play' | 'book' | 'timer' | 'file' | 'heart' | 'brain' | 'sparkles';
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

interface StructuredResponse {
  answer: string; // MUST be shown verbatim
  recommendedActions?: RecommendedAction[];
  availableTools?: string[];
  references?: Reference[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { systemPrompt, messages, pageContext } = body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      console.error('[Buddy API] Invalid request: messages array missing or invalid');
      return NextResponse.json(
        { 
          error: 'Messages array is required',
          answer: 'I need a valid question to help you. Could you try asking again?'
        },
        { status: 400 }
      );
    }

    if (messages.length === 0) {
      console.error('[Buddy API] Empty messages array');
      return NextResponse.json(
        { 
          error: 'Messages array cannot be empty',
          answer: 'Please ask me a question about this page!'
        },
        { status: 400 }
      );
    }

    // Enhance system prompt to request structured output
    const enhancedSystemPrompt = `${systemPrompt}

CRITICAL OUTPUT FORMAT:
You must respond with a JSON object containing:
{
  "answer": "Your plain text answer (will be shown verbatim to user)",
  "recommendedActions": [
    {
      "id": "unique-id",
      "type": "navigate|scroll|start_exercise|open_tool",
      "label": "Button text",
      "description": "Optional short description",
      "icon": "play|timer|book|etc",
      "target": "URL or element ID",
      "primary": true/false
    }
  ],
  "availableTools": ["Timer", "Form", "Quests"],
  "references": [
    {
      "title": "NHS: Breathing exercises for stress",
      "url": "https://www.nhs.uk/...",
      "sourceLabel": "NHS",
      "updatedAt": "2026-01-16",
      "isExternal": true
    }
  ]
}

Page context available: ${JSON.stringify(pageContext || {})}

RULES:
- "answer" field is mandatory and will be displayed exactly as written
- Keep users on NeuroBreath site via recommendedActions
- External references must have isExternal: true
- Recommend 1-3 relevant actions based on the question
- If page has Timer, Breathing exercises, etc., suggest using them`;

    const fullMessages: Message[] = [
      { role: 'system', content: enhancedSystemPrompt },
      ...messages,
    ];

    // Check API key. If missing, degrade gracefully (return a helpful response
    // instead of a 500 so the UI can still work in local/dev environments).
    if (!process.env.ABACUSAI_API_KEY) {
      console.error('[Buddy API] ABACUSAI_API_KEY not configured');

      return NextResponse.json(
        {
          error: 'ABACUSAI_API_KEY not configured',
          answer:
            "I can still help, but I'm currently running in **limited mode** (the AI service isn't configured).\n\nTry: \"What tools are available?\" or \"Show me breathing techniques\" — and I’ll guide you to the right sections.",
          recommendedActions: [
            {
              id: 'open-breathing',
              type: 'navigate',
              label: 'Breathing Exercises',
              description: 'Open Box Breathing and SOS Calm tools',
              icon: 'heart',
              target: '/breathing',
              primary: true,
            },
            {
              id: 'open-adhd',
              type: 'navigate',
              label: 'ADHD Hub',
              description: 'Focus Timer, Daily Quests, Skills Library',
              icon: 'brain',
              target: '/adhd',
            },
            {
              id: 'open-autism',
              type: 'navigate',
              label: 'Autism Hub',
              description: 'Calm Toolkit, Education Pathways',
              icon: 'sparkles',
              target: '/autism',
            },
          ],
          references: [
            {
              title: 'NHS: Breathing exercises for stress',
              url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/',
              sourceLabel: 'NHS',
              updatedAt: new Date().toISOString().split('T')[0],
              isExternal: true,
            },
          ],
          availableTools: [],
        },
        { status: 200 }
      );
    }

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: fullMessages,
        stream: false,
        max_tokens: 800,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(30000), // 30s timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Buddy API] LLM API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      return NextResponse.json(
        {
          error: `LLM API error: ${response.status} ${response.statusText}`,
          answer:
            "I’m having trouble connecting to the AI service right now. I can still guide you around NeuroBreath — what would you like to do next?",
          recommendedActions: [
            {
              id: 'breathing',
              type: 'navigate',
              label: 'Breathing Exercises',
              description: 'Try a quick calming technique',
              icon: 'heart',
              target: '/breathing',
              primary: true,
            },
          ],
          references: [
            {
              title: 'NHS: Breathing exercises for stress',
              url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/',
              sourceLabel: 'NHS',
              isExternal: true,
            },
          ],
          availableTools: [],
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Try to parse as JSON, fallback to plain text
    let structuredResponse: StructuredResponse;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                        content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      structuredResponse = JSON.parse(jsonContent);
    } catch {
      // Fallback: wrap plain text as answer
      structuredResponse = {
        answer: content || 'I\'m here to help! Could you rephrase your question?',
        references: [
          {
            title: 'NHS: Breathing exercises for stress',
            url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/',
            sourceLabel: 'NHS',
            updatedAt: new Date().toISOString().split('T')[0],
            isExternal: true
          },
          {
            title: 'NHS Every Mind Matters',
            url: 'https://www.nhs.uk/every-mind-matters/',
            sourceLabel: 'NHS',
            isExternal: true
          }
        ]
      };
    }

    return NextResponse.json(structuredResponse);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Buddy API] Error:', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // Provide user-friendly fallback response
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        answer: `I apologize for the interruption! I'm having trouble connecting right now, but I'm still here to help.\n\n**In the meantime, you can:**\n• Browse the page sections below\n• Try the Quick Questions buttons\n• Click the 🗺️ map icon for a guided tour\n\nPlease try asking your question again in a moment.`,
        recommendedActions: [
          {
            id: 'tour',
            type: 'scroll',
            label: 'Start Page Tour',
            icon: 'map',
            description: 'Get a guided walkthrough of this page',
            primary: true,
          }
        ],
        references: [
          {
            title: 'NeuroBreath Help Centre',
            url: '/help',
            sourceLabel: 'NeuroBreath',
            isExternal: false,
          }
        ],
        availableTools: [],
      },
      // Return 200 so the client can always display a helpful response.
      { status: 200 }
    );
  }
}
