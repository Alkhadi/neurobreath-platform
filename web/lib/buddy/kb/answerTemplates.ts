/**
 * Answer Template Builder for NeuroBreath Buddy
 * Constructs consistent, professional answers in NeuroBreath-first format
 */

import { BuddyQueryResult, InternalPageMetadata } from './types';

export function buildNeuroBreathAnswer(
  question: string,
  internalPages: InternalPageMetadata[],
  externalCitations?: Array<{ url: string; title: string; publisher: string }>
): BuddyQueryResult {
  const internalOnly = !externalCitations || externalCitations.length === 0;
  const coverage = internalPages.length > 0 ? (internalOnly ? 'internal-only' : 'hybrid') : 'external-only';

  // Build internal links with relevance scoring
  const internalLinks = internalPages.map((page, index) => ({
    url: page.path,
    text: page.title,
    relevance: 1 - index * 0.2 // First result is 1.0, second is 0.8, etc.
  }));

  // Build HTML answer
  let answerHtml = '';

  if (internalPages.length > 0) {
    const topPage = internalPages[0];

    answerHtml = `
      <div class="buddy-answer">
        <div class="answer-section">
          <h3>What this means</h3>
          <p>${buildContextualExplanation(question, topPage)}</p>
        </div>

        <div class="answer-section">
          <h3>What you can do on NeuroBreath now</h3>
          <ul class="answer-links">
            ${internalLinks
              .slice(0, 6)
              .map(
                (link) =>
                  `<li><a href="${link.url}" class="buddy-link">${link.text}</a></li>`
              )
              .join('')}
          </ul>
        </div>

        <div class="answer-section">
          <h3>Recommended next steps</h3>
          <ul class="next-steps">
            ${buildNextSteps(topPage).map((step) => `<li>${step}</li>`).join('')}
          </ul>
        </div>

        ${
          externalCitations && externalCitations.length > 0
            ? `
        <div class="answer-section">
          <h3>Evidence references</h3>
          <ul class="references">
            ${externalCitations
              .map(
                (ref) =>
                  `<li><a href="${ref.url}" target="_blank" rel="noopener noreferrer">${ref.title}</a> <span class="publisher">${ref.publisher}</span></li>`
              )
              .join('')}
          </ul>
        </div>
        `
            : ''
        }
      </div>
    `;
  } else if (externalCitations && externalCitations.length > 0) {
    answerHtml = `
      <div class="buddy-answer">
        <div class="answer-section">
          <p>Based on leading research and health organizations:</p>
          <ul class="references">
            ${externalCitations
              .map(
                (ref) =>
                  `<li><a href="${ref.url}" target="_blank" rel="noopener noreferrer">${ref.title}</a> <span class="publisher">${ref.publisher}</span></li>`
              )
              .join('')}
          </ul>
        </div>
        <div class="answer-section safety-note">
          <p><strong>Note:</strong> If you need immediate support, contact NHS 111 (UK) or call 988 (US).</p>
        </div>
      </div>
    `;
  } else {
    answerHtml = `
      <div class="buddy-answer">
        <div class="answer-section">
          <p>I'm still learning about this topic. Please explore our main NeuroBreath resources or contact support for more information.</p>
        </div>
      </div>
    `;
  }

  return {
    question,
    answerHtml,
    internalLinks,
    externalCitations,
    coverage
  };
}

function buildContextualExplanation(question: string, page: InternalPageMetadata): string {
  // Extract first meaningful paragraph or description
  if (page.description) {
    return page.description;
  }

  // Fallback: construct from headings
  const firstHeading = page.headings.find((h) => h.level === 1);
  if (firstHeading) {
    return `Learn about <strong>${firstHeading.text}</strong> and how NeuroBreath can help.`;
  }

  return `Explore <strong>${page.title}</strong> to find practical support and tools.`;
}

function buildNextSteps(page: InternalPageMetadata): string[] {
  const steps: string[] = [];

  // Add tool recommendations if available
  if (page.toolLinks && page.toolLinks.length > 0) {
    steps.push(`Try the ${page.toolLinks.map((t) => `${t.toolName}`).join(', ')} tool${page.toolLinks.length > 1 ? 's' : ''}`);
  }

  // Add audience-specific recommendations
  if (page.audiences.includes('parents')) {
    steps.push('Check parent-specific resources and guides');
  }
  if (page.audiences.includes('teachers')) {
    steps.push('Explore classroom strategies and teaching tips');
  }
  if (page.audiences.includes('neurodivergent')) {
    steps.push('Complete the interactive challenges to track your progress');
  }

  // Add generic next steps
  if (steps.length === 0) {
    steps.push('Explore the full resource page for comprehensive guidance');
    steps.push('Save this content to your NeuroBreath profile');
  }

  return steps;
}

export function buildMissingCoverageAnswer(
  question: string,
  relatedPages: InternalPageMetadata[],
  externalCitations: Array<{ url: string; title: string; publisher: string }>
): string {
  let html = `
    <div class="buddy-answer">
      <div class="answer-section">
        <p>Based on research from ${externalCitations.map((c) => c.publisher).join(', ')}:</p>
        <ul class="references">
          ${externalCitations
            .map(
              (ref) =>
                `<li><a href="${ref.url}" target="_blank" rel="noopener noreferrer">${ref.title}</a></li>`
            )
            .join('')}
        </ul>
      </div>
  `;

  if (relatedPages.length > 0) {
    html += `
      <div class="answer-section">
        <h3>Related NeuroBreath resources</h3>
        <ul class="answer-links">
          ${relatedPages
            .map((page) => `<li><a href="${page.path}" class="buddy-link">${page.title}</a></li>`)
            .join('')}
        </ul>
      </div>
    `;
  }

  html += `</div>`;
  return html;
}
