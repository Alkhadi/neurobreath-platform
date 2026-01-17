#!/usr/bin/env node

/**
 * NeuroBreath Journey Scaffolder
 * 
 * Generates complete journey flows (landing + steps + completion pages) from config.
 * 
 * Usage:
 *   npm run scaffold:journey -- --journey=new-to-adhd
 *   npm run scaffold:journey -- --all
 *   npm run scaffold:journey -- --journey=parent-autism --force
 * 
 * @see /web/JOURNEYS_GUIDE.md
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.join(__dirname, '../..');

// Parse CLI arguments
const args = process.argv.slice(2);
const journeyArg = args.find(arg => arg.startsWith('--journey='));
const allFlag = args.includes('--all');
const forceFlag = args.includes('--force');

if (!journeyArg && !allFlag) {
  console.error('❌ Error: Must specify --journey=<slug> or --all');
  console.log('\nUsage:');
  console.log('  npm run scaffold:journey -- --journey=new-to-adhd');
  console.log('  npm run scaffold:journey -- --all');
  console.log('  npm run scaffold:journey -- --journey=parent-autism --force');
  process.exit(1);
}

const journeySlug = journeyArg?.split('=')[1];

// Load journeys from config
// We'll parse the TypeScript file directly for available journeys
const configPath = path.join(webRoot, 'journeys/journeys.config.ts');
let allJourneys = [];

try {
  const configContent = await fs.readFile(configPath, 'utf-8');
  console.log('📋 Loading journeys configuration...');
  
  // Extract journey slugs from config (simple parsing)
  const slugMatches = configContent.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
  for (const match of slugMatches) {
    allJourneys.push(match[1]);
  }
  
  if (allJourneys.length === 0) {
    console.warn('⚠️  Warning: No journeys found in config, using defaults');
    allJourneys = ['new-to-adhd', 'parent-autism', 'adult-dyslexia-work'];
  }
} catch (error) {
  console.error('❌ Error: Could not load journeys.config.ts');
  console.error('Make sure /web/journeys/journeys.config.ts exists');
  process.exit(1);
}

if (journeySlug && !allJourneys.includes(journeySlug)) {
  console.error(`❌ Error: Journey "${journeySlug}" not found in config`);
  console.log(`\nAvailable journeys: ${allJourneys.join(', ')}`);
  process.exit(1);
}

const journeysToGenerate = allFlag ? allJourneys : [journeySlug];

console.log(`\n🚀 Scaffolding ${journeysToGenerate.length} journey(s)...\n`);

/**
 * Validate journey configuration
 */
function validateJourneyConfig(journey) {
  const errors = [];

  if (!journey.id || !journey.slug) {
    errors.push('Missing id or slug');
  }

  if (!journey.titleUK || !journey.titleUS) {
    errors.push('Missing UK or US title');
  }

  if (!journey.steps || journey.steps.length < 3 || journey.steps.length > 5) {
    errors.push('Must have 3-5 steps');
  }

  if (!journey.completion) {
    errors.push('Missing completion section');
  }

  return errors;
}

/**
 * Check if file exists
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensure directory exists
 */
async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

/**
 * Generate landing page
 */
function generateLandingPage(journey, region) {
  const title = escapeString(region === 'uk' ? journey.titleUK : journey.titleUS);
  const description = escapeString(region === 'uk' ? journey.descriptionUK : journey.descriptionUS);
  const baseUrl = region === 'uk' ? '/uk' : '/us';
  
  const stepsJSX = journey.steps.map((step, idx) => {
    const stepTitle = escapeString(region === 'uk' ? step.titleUK : step.titleUS);
    const stepSummary = escapeString(region === 'uk' ? step.summaryUK : step.summaryUS);
    return `          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              ${idx + 1}
            </span>
            <div>
              <h3 className="font-medium">${stepTitle}</h3>
              <p className="text-sm text-muted-foreground">${stepSummary}</p>
            </div>
          </li>`;
  }).join('\n');
  
  return `import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: '${title} | NeuroBreath',
  description: '${description}',
  alternates: {
    canonical: 'https://neurobreath.co.uk${baseUrl}/journeys/${journey.slug}',
    languages: {
      'en-GB': 'https://neurobreath.co.uk/uk/journeys/${journey.slug}',
      'en-US': 'https://neurobreath.co.uk/us/journeys/${journey.slug}',
    },
  },
  openGraph: {
    title: '${title}',
    description: '${description}',
    url: 'https://neurobreath.co.uk${baseUrl}/journeys/${journey.slug}',
    type: 'website',
  },
};

export default function JourneyLanding() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">${title}</h1>
        <p className="text-xl text-muted-foreground mb-6">
          ${description}
        </p>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>~${journey.estimatedMinutes} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>For: ${journey.audience.join(', ')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>${journey.steps.length} steps</span>
          </div>
        </div>
      </header>

      {/* Journey Steps Overview */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What You&apos;ll Learn</h2>
        <ol className="space-y-3">
${stepsJSX}
        </ol>
      </section>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button asChild size="lg" className="flex-1">
          <Link href="${baseUrl}/journeys/${journey.slug}/step/1">
            Start Journey
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="flex-1">
          <Link href="${baseUrl}/help-me-choose">
            Help Me Choose
          </Link>
        </Button>
      </div>

      {/* Trust Block */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Educational Resource</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This journey provides educational information only and is not a substitute for 
            professional medical advice, diagnosis, or treatment. Always seek guidance from 
            qualified healthcare providers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
`;
}

/**
 * Generate step page
 */
function generateStepPage(journey, stepIndex, region) {
  const step = journey.steps[stepIndex];
  const stepNumber = stepIndex + 1;
  const totalSteps = journey.steps.length;
  const baseUrl = region === 'uk' ? '/uk' : '/us';
  const title = escapeString(region === 'uk' ? step.titleUK : step.titleUS);
  const summary = escapeString(region === 'uk' ? step.summaryUK : step.summaryUS);
  
  const prevLink = stepNumber > 1 
    ? `${baseUrl}/journeys/${journey.slug}/step/${stepNumber - 1}` 
    : `${baseUrl}/journeys/${journey.slug}`;
  
  const nextLink = stepNumber < totalSteps
    ? `${baseUrl}/journeys/${journey.slug}/step/${stepNumber + 1}`
    : `${baseUrl}/journeys/${journey.slug}/complete`;

  const keyActionsJSX = step.keyActions.map((action) => 
    `            <li className="flex gap-3">
              <span className="text-primary flex-shrink-0">✓</span>
              <span>${escapeString(action)}</span>
            </li>`
  ).join('\n');

  const suggestedToolsSection = step.suggestedTools && step.suggestedTools.length > 0
    ? `
        {/* Suggested Tools */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recommended Tools</h2>
          <div className="grid gap-4 sm:grid-cols-2">
${step.suggestedTools.map((tool) => 
  `            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  ${tool.replace(/\//g, ' › ').replace(/-/g, ' ')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="${baseUrl}/tools/${tool}">
                    Try This Tool
                  </Link>
                </Button>
              </CardContent>
            </Card>`
).join('\n')}
          </div>
        </section>`
    : '';

  const suggestedGuidesSection = step.suggestedGuides && step.suggestedGuides.length > 0
    ? `
        {/* Suggested Guides */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recommended Guides</h2>
          <ul className="space-y-2">
${step.suggestedGuides.map((guide) =>
  `            <li>
              <Link 
                href="${baseUrl}/guides/${guide}"
                className="text-primary hover:underline inline-flex items-center gap-2"
              >
                <span>→</span>
                <span>${guide.replace(/\//g, ' › ').replace(/-/g, ' ')}</span>
              </Link>
            </li>`
).join('\n')}
          </ul>
        </section>`
    : '';

  const faqSection = step.faq && step.faq.length > 0
    ? `
        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Common Questions</h2>
          <div className="space-y-4">
${step.faq.map((item) => {
  const answer = escapeString(region === 'uk' ? item.aUK : (item.aUS || item.aUK));
  return `            <Card>
              <CardHeader>
                <CardTitle className="text-lg">${escapeString(item.q)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">${answer}</p>
              </CardContent>
            </Card>`;
}).join('\n')}
          </div>
        </section>`
    : '';

  return `import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: '${title} - Step ${stepNumber} | NeuroBreath',
  description: '${summary}',
  alternates: {
    canonical: 'https://neurobreath.co.uk${baseUrl}/journeys/${journey.slug}/step/${stepNumber}',
    languages: {
      'en-GB': 'https://neurobreath.co.uk/uk/journeys/${journey.slug}/step/${stepNumber}',
      'en-US': 'https://neurobreath.co.uk/us/journeys/${journey.slug}/step/${stepNumber}',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function JourneyStep() {
  const stepNumber = ${stepNumber};
  const totalSteps = ${totalSteps};
  const progressPercent = Math.round((stepNumber / totalSteps) * 100);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Step {stepNumber} of {totalSteps}</span>
          <span>{progressPercent}% complete</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all"
            style={{ width: \`\${progressPercent}%\` }}
          />
        </div>
      </div>

      {/* Content */}
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">${title}</h1>
          <p className="text-lg text-muted-foreground">${summary}</p>
        </header>

        {/* Key Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Actions</h2>
          <ul className="space-y-3">
${keyActionsJSX}
          </ul>
        </section>
${suggestedToolsSection}${suggestedGuidesSection}${faqSection}
      </article>

      {/* Navigation */}
      <nav className="flex justify-between pt-8 border-t">
        <Button asChild variant="outline">
          <Link href="${prevLink}">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Link>
        </Button>
        <Button asChild>
          <Link href="${nextLink}">
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </nav>

      {/* Trust Disclaimer */}
      <Card className="mt-8 bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground">
            Educational information only. Not medical advice. 
            Consult qualified healthcare providers for personal guidance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
`;
}

/**
 * Escape string for use in template
 */
function escapeString(str) {
  return str.replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

/**
 * Generate completion page
 */
function generateCompletionPage(journey, region) {
  const completion = journey.completion;
  const title = escapeString(region === 'uk' ? completion.titleUK : completion.titleUS);
  const summary = escapeString(region === 'uk' ? completion.summaryUK : completion.summaryUS);
  const baseUrl = region === 'uk' ? '/uk' : '/us';

  const nextStepsJSX = completion.nextSteps.map((step) => {
    const stepTitle = escapeString(region === 'uk' ? step.titleUK : step.titleUS);
    const stepDesc = escapeString(region === 'uk' ? step.descriptionUK : step.descriptionUS);
    const stepLink = region === 'uk' ? step.linkUK : step.linkUS;
    
    return `          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>${stepTitle}</CardTitle>
              <CardDescription>${stepDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="${stepLink}">
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>`;
  }).join('\n');

  const stepsRecapJSX = journey.steps.map((step) => {
    const stepTitle = escapeString(region === 'uk' ? step.titleUK : step.titleUS);
    return `            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span>${stepTitle}</span>
            </li>`;
  }).join('\n');

  return `import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: '${title} - Journey Complete | NeuroBreath',
  description: '${summary}',
  alternates: {
    canonical: 'https://neurobreath.co.uk${baseUrl}/journeys/${journey.slug}/complete',
    languages: {
      'en-GB': 'https://neurobreath.co.uk/uk/journeys/${journey.slug}/complete',
      'en-US': 'https://neurobreath.co.uk/us/journeys/${journey.slug}/complete',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function JourneyComplete() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Success Message */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4">${title}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          ${summary}
        </p>
      </div>

      {/* Next Steps */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">What&apos;s Next?</h2>
        <div className="grid gap-6 md:grid-cols-${completion.nextSteps.length >= 3 ? '3' : '2'}">
${nextStepsJSX}
        </div>
      </section>

      {/* Journey Recap */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Journey Recap</CardTitle>
          <CardDescription>You completed all ${journey.steps.length} steps</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
${stepsRecapJSX}
          </ol>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="${baseUrl}/journeys">
            Explore More Journeys
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="${baseUrl}">
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
`;
}

/**
 * Generate content module
 */
function generateContentModule(journey) {
  return `/**
 * Content for journey: ${journey.slug}
 * Generated by scaffold-journey.mjs
 * 
 * Edit this file to customize copy while maintaining UK/US variants.
 * Source of truth for journey content across both regions.
 */

export interface JourneyContent {
  title: string;
  description: string;
  steps: Array<{
    title: string;
    summary: string;
    keyActions: string[];
    suggestedTools?: string[];
    suggestedGuides?: string[];
    faq?: Array<{
      q: string;
      a: string;
    }>;
  }>;
  completion: {
    title: string;
    summary: string;
    nextSteps: Array<{
      title: string;
      link: string;
      description: string;
    }>;
  };
}

// Journey metadata
export const journey = {
  id: '${journey.slug}',
  slug: '${journey.slug}',
  audience: ${JSON.stringify(journey.audience)},
  primaryConditions: ${JSON.stringify(journey.primaryConditions)},
  estimatedMinutes: ${journey.estimatedMinutes},
  steps: ${JSON.stringify(journey.steps)},
  
  uk: {
    title: \`${journey.titleUK}\`,
    description: \`${journey.descriptionUK}\`,
    steps: ${JSON.stringify(
      journey.steps.map(step => ({
        title: step.titleUK,
        summary: step.summaryUK,
        keyActions: step.keyActions,
        suggestedTools: step.suggestedTools,
        suggestedGuides: step.suggestedGuides,
        faq: step.faq?.map(f => ({ q: f.q, a: f.aUK })),
      }))
    )},
    completion: {
      title: \`${journey.completion.titleUK}\`,
      summary: \`${journey.completion.summaryUK}\`,
      nextSteps: ${JSON.stringify(
        journey.completion.nextSteps.map(ns => ({
          title: ns.titleUK,
          link: ns.linkUK,
          description: ns.descriptionUK,
        }))
      )},
    },
  } as JourneyContent,
  
  us: {
    title: \`${journey.titleUS}\`,
    description: \`${journey.descriptionUS}\`,
    steps: ${JSON.stringify(
      journey.steps.map(step => ({
        title: step.titleUS,
        summary: step.summaryUS,
        keyActions: step.keyActions,
        suggestedTools: step.suggestedTools,
        suggestedGuides: step.suggestedGuides,
        faq: step.faq?.map(f => ({ q: f.q, a: f.aUS || f.aUK })),
      }))
    )},
    completion: {
      title: \`${journey.completion.titleUS}\`,
      summary: \`${journey.completion.summaryUS}\`,
      nextSteps: ${JSON.stringify(
        journey.completion.nextSteps.map(ns => ({
          title: ns.titleUS,
          link: ns.linkUS,
          description: ns.descriptionUS,
        }))
      )},
    },
  } as JourneyContent,
};
`;
}

/**
 * Load journey data from config
 */
async function loadJourneyData(slug) {
  const configPath = path.join(webRoot, 'journeys/journeys.config.ts');
  await fs.access(configPath);
  
  // For now, return a template structure that will be filled from actual config
  // In production, use proper TS compilation or ts-node
  return {
    id: slug,
    slug,
    titleUK: `Journey: ${slug}`,
    titleUS: `Journey: ${slug}`,
    descriptionUK: `A guided journey for ${slug}`,
    descriptionUS: `A guided journey for ${slug}`,
    audience: ['adult'],
    primaryConditions: [slug.split('-')[0]],
    recommendedTools: [],
    recommendedGuides: [],
    estimatedMinutes: 20,
    steps: [
      {
        stepId: 'step-1',
        titleUK: 'First Steps',
        titleUS: 'First Steps',
        summaryUK: 'Begin your journey',
        summaryUS: 'Begin your journey',
        keyActions: ['Learn the basics', 'Identify your needs', 'Set goals'],
        suggestedTools: [],
        suggestedGuides: [],
      },
      {
        stepId: 'step-2',
        titleUK: 'Building Understanding',
        titleUS: 'Building Understanding',
        summaryUK: 'Deepen your knowledge',
        summaryUS: 'Deepen your knowledge',
        keyActions: ['Explore strategies', 'Try new approaches', 'Reflect on progress'],
        suggestedTools: [],
        suggestedGuides: [],
      },
      {
        stepId: 'step-3',
        titleUK: 'Moving Forward',
        titleUS: 'Moving Forward',
        summaryUK: 'Plan for continued growth',
        summaryUS: 'Plan for continued growth',
        keyActions: ['Create routines', 'Build resilience', 'Celebrate wins'],
        suggestedTools: [],
        suggestedGuides: [],
      },
    ],
    completion: {
      titleUK: 'Journey Complete',
      titleUS: 'Journey Complete',
      summaryUK: 'You\'ve taken important first steps',
      summaryUS: 'You\'ve taken important first steps',
      nextSteps: [
        {
          titleUK: 'Explore Tools',
          titleUS: 'Explore Tools',
          linkUK: '/uk/tools',
          linkUS: '/us/tools',
          descriptionUK: 'Try practical tools',
          descriptionUS: 'Try practical tools',
        },
        {
          titleUK: 'Read Guides',
          titleUS: 'Read Guides',
          linkUK: '/uk/guides',
          linkUS: '/us/guides',
          descriptionUK: 'Deepen your understanding',
          descriptionUS: 'Deepen your understanding',
        },
        {
          titleUK: 'Get Help',
          titleUS: 'Get Help',
          linkUK: '/uk/help-me-choose',
          linkUS: '/us/help-me-choose',
          descriptionUK: 'Find personalised recommendations',
          descriptionUS: 'Find personalized recommendations',
        },
      ],
    },
  };
}

/**
 * Generate journey files
 */
async function generateJourney(slug) {
  console.log(`📝 Generating journey: ${slug}`);
  
  // Load journey config
  const journey = await loadJourneyData(slug);

  // Validate
  const validationErrors = validateJourneyConfig(journey);
  if (validationErrors.length > 0) {
    console.error(`❌ Validation failed for ${slug}:`);
    validationErrors.forEach(err => console.error(`   - ${err}`));
    return false;
  }

  const createdFiles = [];

  // Generate for both regions
  for (const region of ['uk', 'us']) {
    const regionPath = path.join(webRoot, 'app', region, 'journeys', slug);

    // Check if exists
    if (!forceFlag && await fileExists(path.join(regionPath, 'page.tsx'))) {
      console.warn(`⚠️  Warning: ${region}/journeys/${slug} already exists (use --force to overwrite)`);
      continue;
    }

    // Landing page
    await ensureDir(regionPath);
    const landingPath = path.join(regionPath, 'page.tsx');
    await fs.writeFile(landingPath, generateLandingPage(journey, region));
    createdFiles.push(landingPath);

    // Step pages
    for (let i = 0; i < journey.steps.length; i++) {
      const stepPath = path.join(regionPath, 'step', String(i + 1));
      await ensureDir(stepPath);
      const stepFilePath = path.join(stepPath, 'page.tsx');
      await fs.writeFile(stepFilePath, generateStepPage(journey, i, region));
      createdFiles.push(stepFilePath);
    }

    // Completion page
    const completePath = path.join(regionPath, 'complete');
    await ensureDir(completePath);
    const completeFilePath = path.join(completePath, 'page.tsx');
    await fs.writeFile(completeFilePath, generateCompletionPage(journey, region));
    createdFiles.push(completeFilePath);
  }

  // Content module
  const contentPath = path.join(webRoot, 'content', 'journeys');
  await ensureDir(contentPath);
  const contentFilePath = path.join(contentPath, `${slug}.content.ts`);
  await fs.writeFile(contentFilePath, generateContentModule(journey));
  createdFiles.push(contentFilePath);

  console.log(`✅ Created ${createdFiles.length} files for journey: ${slug}`);
  return true;
}

/**
 * Main execution
 */
async function main() {
  let successCount = 0;
  let failCount = 0;

  for (const slug of journeysToGenerate) {
    try {
      const success = await generateJourney(slug);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (error) {
      console.error(`❌ Error generating journey ${slug}:`, error.message);
      failCount++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Successfully generated: ${successCount} journey(s)`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount} journey(s)`);
  }
  console.log(`${'='.repeat(50)}\n`);

  if (successCount > 0) {
    console.log('Next steps:');
    console.log('1. Review generated files');
    console.log('2. Customize content in /web/content/journeys/*.content.ts');
    console.log('3. Run: npm run lint');
    console.log('4. Run: npm run typecheck');
    console.log('5. Run: npm run build');
    console.log('6. Update search index and sitemap if needed\n');
  }

  process.exit(failCount > 0 ? 1 : 0);
}

main();
