import { NextRequest, NextResponse } from 'next/server';
import { synthesizeAnswer } from '@/lib/ai-coach/synthesis';
import { parseIntent } from '@/lib/ai-coach/intent';
import { getNHSLinks, getNHSCrisisLinks } from '@/lib/ai-coach/nhs';
import { getNICELinks } from '@/lib/ai-coach/nice';
import { searchPubMed, buildPubMedQuery } from '@/lib/ai-coach/pubmed';
import { getNeuroBreathTools } from '@/lib/ai-coach/kb';
import type { AICoachAnswer } from '@/types/ai-coach';
import type { Topic } from '@/types/user-context';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
}

function formatAnswerAsText(answer: AICoachAnswer): string {
  let text = '';

  // Title
  if (answer.title) {
    text += `# ${answer.title}\n\n`;
  }

  // Plain English Summary
  if (answer.plainEnglishSummary && answer.plainEnglishSummary.length > 0) {
    text += answer.plainEnglishSummary.join('\n\n') + '\n\n';
  }

  // Practical Actions
  if (answer.practicalActions && answer.practicalActions.length > 0) {
    text += '## Practical Actions\n\n';
    answer.practicalActions.forEach((action) => {
      text += `• ${action}\n`;
    });
    text += '\n';
  }

  // Tailored Guidance
  if (answer.tailoredGuidance) {
    if (answer.tailoredGuidance.parents && answer.tailoredGuidance.parents.length > 0) {
      text += '## For Parents\n\n';
      answer.tailoredGuidance.parents.forEach((item) => {
        text += `• ${item}\n`;
      });
      text += '\n';
    }
    if (answer.tailoredGuidance.teachers && answer.tailoredGuidance.teachers.length > 0) {
      text += '## For Teachers\n\n';
      answer.tailoredGuidance.teachers.forEach((item) => {
        text += `• ${item}\n`;
      });
      text += '\n';
    }
  }

  // Evidence
  if (answer.evidence) {
    if (answer.evidence.nhsOrNice && answer.evidence.nhsOrNice.length > 0) {
      text += '## NHS & NICE Guidelines\n\n';
      answer.evidence.nhsOrNice.forEach((source) => {
        text += `• [${source.title}](${source.url})\n`;
      });
      text += '\n';
    }
    if (answer.evidence.pubmed && answer.evidence.pubmed.length > 0) {
      text += '## Research Evidence\n\n';
      answer.evidence.pubmed.forEach((source) => {
        text += `• ${source.title} - [View on PubMed](${source.url})\n`;
      });
      text += '\n';
    }
  }

  // NeuroBreath Tools
  if (answer.neurobreathTools && answer.neurobreathTools.length > 0) {
    text += '## Helpful Tools\n\n';
    answer.neurobreathTools.forEach((tool) => {
      text += `• [${tool.title}](${tool.url}) - ${tool.why}\n`;
    });
    text += '\n';
  }

  // Safety Notice
  if (answer.safetyNotice) {
    text += `\n⚠️ **Important:** ${answer.safetyNotice}\n\n`;
  }

  // Follow-up Questions
  if (answer.followUpQuestions && answer.followUpQuestions.length > 0) {
    text += '## You might also want to ask:\n\n';
    answer.followUpQuestions.forEach((q) => {
      text += `• ${q}\n`;
    });
  }

  return text;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array required' },
        { status: 400 }
      );
    }

    // Get the last user message
    const lastUserMessage = messages
      .filter((m) => m.role === 'user')
      .pop();

    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'No user message found' },
        { status: 400 }
      );
    }

    const question = lastUserMessage.content;

    // Parse intent
    const intent = parseIntent(question);

    // Handle crisis situations immediately
    if (intent.needsCrisisResponse) {
      const crisisLinks = getNHSCrisisLinks();
      const crisisAnswer = synthesizeAnswer({
        question,
        intent,
        nhsLinks: crisisLinks,
        niceLinks: [],
        pubmedArticles: [],
        audience: 'parents',
        neurobreathTools: [],
      });

      const formattedText = formatAnswerAsText(crisisAnswer);
      return createStreamingResponse(formattedText);
    }

    // Retrieve evidence sources in parallel
    const topic = (intent.topic || 'autism') as Topic;
    const [nhsLinks, niceLinks, pubmedArticles, neurobreathTools] =
      await Promise.all([
        Promise.resolve(getNHSLinks(question, topic)),
        Promise.resolve(getNICELinks(question, topic)),
        searchPubMed(buildPubMedQuery(question, intent, topic), 6),
        Promise.resolve(getNeuroBreathTools(question, topic)),
      ]);

    // Synthesize comprehensive answer
    const answer = synthesizeAnswer({
      question,
      intent,
      nhsLinks,
      niceLinks,
      pubmedArticles,
      audience: 'parents',
      neurobreathTools,
      topic,
    });

    const formattedText = formatAnswerAsText(answer);
    return createStreamingResponse(formattedText);
  } catch (error) {
    console.error('[AI Chat API] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process chat request',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function createStreamingResponse(text: string): Response {
  const encoder = new TextEncoder();

  // Create a readable stream
  const stream = new ReadableStream({
    async start(controller) {
      // Split text into words for smoother streaming
      const words = text.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        const chunk = i === 0 ? words[i] : ' ' + words[i];
        
        // Format as SSE (Server-Sent Events) compatible with OpenAI format
        const sseData = JSON.stringify({
          choices: [
            {
              delta: {
                content: chunk,
              },
            },
          ],
        });

        controller.enqueue(encoder.encode(`data: ${sseData}\n\n`));

        // Add a small delay to simulate streaming (optional)
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      // Send done signal
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
