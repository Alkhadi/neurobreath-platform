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
    const { systemPrompt, messages, pageContext } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
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
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('LLM API error:', errorText);
      throw new Error(`LLM API error: ${response.statusText}`);
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
    console.error('AI Chat Buddy API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        answer: 'I apologize, but I encountered an error. Please try asking your question again.',
        references: []
      },
      { status: 500 }
    );
  }
}
