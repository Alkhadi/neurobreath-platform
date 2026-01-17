/**
 * NeuroBreath Journeys Configuration
 * 
 * Defines all starter journey flows available on the platform.
 * Each journey is a multi-step guided experience (3-5 pages) that helps users
 * navigate specific situations or goals.
 * 
 * @see /web/JOURNEYS_GUIDE.md for detailed documentation
 */

export interface JourneyStep {
  stepId: string;
  titleUK: string;
  titleUS: string;
  summaryUK: string;
  summaryUS: string;
  keyActions: string[];
  suggestedTools: string[];
  suggestedGuides: string[];
  faq?: Array<{
    q: string;
    aUK: string;
    aUS?: string;
  }>;
}

export interface JourneyCompletion {
  titleUK: string;
  titleUS: string;
  summaryUK: string;
  summaryUS: string;
  nextSteps: Array<{
    titleUK: string;
    titleUS: string;
    linkUK: string;
    linkUS: string;
    descriptionUK: string;
    descriptionUS: string;
  }>;
}

export interface JourneyConfig {
  id: string;
  slug: string;
  titleUK: string;
  titleUS: string;
  descriptionUK: string;
  descriptionUS: string;
  audience: Array<'adult' | 'parent' | 'teacher' | 'workplace'>;
  primaryConditions: string[];
  recommendedTools: string[];
  recommendedGuides: string[];
  estimatedMinutes: number;
  steps: JourneyStep[];
  completion: JourneyCompletion;
}

/**
 * All configured journeys
 */
export const journeys: JourneyConfig[] = [
  {
    id: 'new-to-adhd',
    slug: 'new-to-adhd',
    titleUK: 'New to ADHD: Your Starting Guide',
    titleUS: 'New to ADHD: Your Starting Guide',
    descriptionUK: 'A step-by-step guide for adults newly diagnosed with ADHD',
    descriptionUS: 'A step-by-step guide for adults newly diagnosed with ADHD',
    audience: ['adult'],
    primaryConditions: ['adhd'],
    recommendedTools: ['breathing/box-breathing', 'pomodoro'],
    recommendedGuides: ['adhd/understanding-basics'],
    estimatedMinutes: 20,
    steps: [
      {
        stepId: 'understand-adhd',
        titleUK: 'Understanding ADHD',
        titleUS: 'Understanding ADHD',
        summaryUK: 'Learn what ADHD is and how it affects daily life',
        summaryUS: 'Learn what ADHD is and how it affects daily life',
        keyActions: [
          'Read about ADHD fundamentals',
          'Identify your main challenges',
          'Recognise your strengths',
        ],
        suggestedTools: ['breathing/box-breathing'],
        suggestedGuides: ['adhd/understanding-basics'],
        faq: [
          {
            q: 'Is ADHD a real condition?',
            aUK: 'Yes, ADHD is a recognised neurodevelopmental condition supported by extensive research. It affects executive functions in the brain.',
            aUS: 'Yes, ADHD is a recognized neurodevelopmental condition supported by extensive research. It affects executive functions in the brain.',
          },
        ],
      },
      {
        stepId: 'identify-challenges',
        titleUK: 'Identifying Your Challenges',
        titleUS: 'Identifying Your Challenges',
        summaryUK: 'Recognise specific areas where ADHD affects you most',
        summaryUS: 'Recognize specific areas where ADHD affects you most',
        keyActions: [
          'List your top 3 daily challenges',
          'Note when symptoms are strongest',
          'Consider environmental factors',
        ],
        suggestedTools: [],
        suggestedGuides: ['adhd/daily-strategies'],
      },
      {
        stepId: 'build-toolkit',
        titleUK: 'Building Your Toolkit',
        titleUS: 'Building Your Toolkit',
        summaryUK: 'Explore practical tools and strategies',
        summaryUS: 'Explore practical tools and strategies',
        keyActions: [
          'Try breathing exercises',
          'Experiment with focus techniques',
          'Set up simple routines',
        ],
        suggestedTools: ['breathing/box-breathing', 'pomodoro'],
        suggestedGuides: [],
      },
      {
        stepId: 'next-steps',
        titleUK: 'Planning Next Steps',
        titleUS: 'Planning Next Steps',
        summaryUK: 'Create a sustainable approach for ongoing support',
        summaryUS: 'Create a sustainable approach for ongoing support',
        keyActions: [
          'Choose 1-2 tools to use daily',
          'Set realistic goals',
          'Plan for setbacks',
        ],
        suggestedTools: [],
        suggestedGuides: ['adhd/long-term-strategies'],
      },
    ],
    completion: {
      titleUK: 'You\'re On Your Way',
      titleUS: 'You\'re On Your Way',
      summaryUK: 'You\'ve taken important first steps in understanding and managing ADHD.',
      summaryUS: 'You\'ve taken important first steps in understanding and managing ADHD.',
      nextSteps: [
        {
          titleUK: 'Build Your Routine',
          titleUS: 'Build Your Routine',
          linkUK: '/uk/tools',
          linkUS: '/us/tools',
          descriptionUK: 'Explore tools to support daily life',
          descriptionUS: 'Explore tools to support daily life',
        },
        {
          titleUK: 'Dive Deeper',
          titleUS: 'Dive Deeper',
          linkUK: '/uk/guides/adhd',
          linkUS: '/us/guides/adhd',
          descriptionUK: 'Read comprehensive guides',
          descriptionUS: 'Read comprehensive guides',
        },
        {
          titleUK: 'Get Help Choosing',
          titleUS: 'Get Help Choosing',
          linkUK: '/uk/help-me-choose',
          linkUS: '/us/help-me-choose',
          descriptionUK: 'Use our wizard to find personalised recommendations',
          descriptionUS: 'Use our wizard to find personalized recommendations',
        },
      ],
    },
  },
  {
    id: 'parent-autism',
    slug: 'parent-autism',
    titleUK: 'Supporting Your Autistic Child',
    titleUS: 'Supporting Your Autistic Child',
    descriptionUK: 'A guide for parents navigating autism support',
    descriptionUS: 'A guide for parents navigating autism support',
    audience: ['parent'],
    primaryConditions: ['autism'],
    recommendedTools: ['sensory/calm-corner'],
    recommendedGuides: ['autism/parent-guide'],
    estimatedMinutes: 25,
    steps: [
      {
        stepId: 'understanding-autism',
        titleUK: 'Understanding Autism',
        titleUS: 'Understanding Autism',
        summaryUK: 'Learn about autism and neurodiversity',
        summaryUS: 'Learn about autism and neurodiversity',
        keyActions: [
          'Understand autism as a difference, not a deficit',
          'Recognise your child\'s unique strengths',
          'Learn about sensory needs',
        ],
        suggestedTools: [],
        suggestedGuides: ['autism/understanding-basics'],
      },
      {
        stepId: 'home-strategies',
        titleUK: 'Creating Supportive Environments',
        titleUS: 'Creating Supportive Environments',
        summaryUK: 'Adapt your home to support sensory needs',
        summaryUS: 'Adapt your home to support sensory needs',
        keyActions: [
          'Identify sensory triggers',
          'Create calm spaces',
          'Establish predictable routines',
        ],
        suggestedTools: ['sensory/calm-corner'],
        suggestedGuides: ['autism/sensory-strategies'],
      },
      {
        stepId: 'communication',
        titleUK: 'Communication Strategies',
        titleUS: 'Communication Strategies',
        summaryUK: 'Support your child\'s communication style',
        summaryUS: 'Support your child\'s communication style',
        keyActions: [
          'Use clear, concrete language',
          'Allow processing time',
          'Respect non-verbal communication',
        ],
        suggestedTools: [],
        suggestedGuides: ['autism/communication'],
      },
      {
        stepId: 'ongoing-support',
        titleUK: 'Building Long-Term Support',
        titleUS: 'Building Long-Term Support',
        summaryUK: 'Plan for continued growth and development',
        summaryUS: 'Plan for continued growth and development',
        keyActions: [
          'Connect with other parents',
          'Advocate for your child',
          'Take care of yourself',
        ],
        suggestedTools: [],
        suggestedGuides: ['autism/parent-self-care'],
      },
    ],
    completion: {
      titleUK: 'You\'re Building Great Foundations',
      titleUS: 'You\'re Building Great Foundations',
      summaryUK: 'You\'ve taken important steps in supporting your child\'s unique needs.',
      summaryUS: 'You\'ve taken important steps in supporting your child\'s unique needs.',
      nextSteps: [
        {
          titleUK: 'Explore Resources',
          titleUS: 'Explore Resources',
          linkUK: '/uk/conditions/autism',
          linkUS: '/us/conditions/autism',
          descriptionUK: 'Access comprehensive autism resources',
          descriptionUS: 'Access comprehensive autism resources',
        },
        {
          titleUK: 'Try Tools',
          titleUS: 'Try Tools',
          linkUK: '/uk/tools',
          linkUS: '/us/tools',
          descriptionUK: 'Explore sensory and regulation tools',
          descriptionUS: 'Explore sensory and regulation tools',
        },
        {
          titleUK: 'Join Community',
          titleUS: 'Join Community',
          linkUK: '/uk/about',
          linkUS: '/us/about',
          descriptionUK: 'Connect with other parents',
          descriptionUS: 'Connect with other parents',
        },
      ],
    },
  },
  {
    id: 'adult-dyslexia-work',
    slug: 'adult-dyslexia-work',
    titleUK: 'Dyslexia at Work: Thriving Professionally',
    titleUS: 'Dyslexia at Work: Thriving Professionally',
    descriptionUK: 'Navigate workplace challenges with dyslexia',
    descriptionUS: 'Navigate workplace challenges with dyslexia',
    audience: ['adult', 'workplace'],
    primaryConditions: ['dyslexia'],
    recommendedTools: ['reading/text-to-speech'],
    recommendedGuides: ['dyslexia/workplace-strategies'],
    estimatedMinutes: 20,
    steps: [
      {
        stepId: 'workplace-rights',
        titleUK: 'Understanding Your Rights',
        titleUS: 'Understanding Your Rights',
        summaryUK: 'Learn about workplace protections and accommodations',
        summaryUS: 'Learn about workplace protections and accommodations',
        keyActions: [
          'Review equality legislation',
          'Understand reasonable adjustments',
          'Know your disclosure options',
        ],
        suggestedTools: [],
        suggestedGuides: ['dyslexia/workplace-rights'],
      },
      {
        stepId: 'communication',
        titleUK: 'Effective Communication',
        titleUS: 'Effective Communication',
        summaryUK: 'Advocate for your needs professionally',
        summaryUS: 'Advocate for your needs professionally',
        keyActions: [
          'Frame requests positively',
          'Focus on outcomes',
          'Suggest specific adjustments',
        ],
        suggestedTools: [],
        suggestedGuides: ['dyslexia/disclosure'],
      },
      {
        stepId: 'tools-strategies',
        titleUK: 'Tools and Strategies',
        titleUS: 'Tools and Strategies',
        summaryUK: 'Use technology to support your work',
        summaryUS: 'Use technology to support your work',
        keyActions: [
          'Explore text-to-speech tools',
          'Use visual organisation systems',
          'Leverage your strengths',
        ],
        suggestedTools: ['reading/text-to-speech'],
        suggestedGuides: ['dyslexia/tech-tools'],
      },
    ],
    completion: {
      titleUK: 'You\'re Equipped to Succeed',
      titleUS: 'You\'re Equipped to Succeed',
      summaryUK: 'You have strategies and knowledge to thrive in your workplace.',
      summaryUS: 'You have strategies and knowledge to thrive in your workplace.',
      nextSteps: [
        {
          titleUK: 'Explore More Strategies',
          titleUS: 'Explore More Strategies',
          linkUK: '/uk/guides/dyslexia',
          linkUS: '/us/guides/dyslexia',
          descriptionUK: 'Read comprehensive dyslexia guides',
          descriptionUS: 'Read comprehensive dyslexia guides',
        },
        {
          titleUK: 'Try Assistive Tools',
          titleUS: 'Try Assistive Tools',
          linkUK: '/uk/tools',
          linkUS: '/us/tools',
          descriptionUK: 'Explore reading and organisation tools',
          descriptionUS: 'Explore reading and organization tools',
        },
        {
          titleUK: 'Learn About Rights',
          titleUS: 'Learn About Rights',
          linkUK: '/uk/about/trust-centre',
          linkUS: '/us/about/trust-centre',
          descriptionUK: 'Access workplace rights information',
          descriptionUS: 'Access workplace rights information',
        },
      ],
    },
  },
];

/**
 * Get a journey by slug
 */
export function getJourneyBySlug(slug: string): JourneyConfig | undefined {
  return journeys.find((j) => j.slug === slug);
}

/**
 * Get all journey slugs (for static generation)
 */
export function getAllJourneySlugs(): string[] {
  return journeys.map((j) => j.slug);
}

/**
 * Validate a journey configuration
 */
export function validateJourney(journey: JourneyConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!journey.id || !journey.slug) {
    errors.push('Journey must have id and slug');
  }

  if (!journey.titleUK || !journey.titleUS) {
    errors.push('Journey must have UK and US titles');
  }

  if (journey.steps.length < 3 || journey.steps.length > 5) {
    errors.push('Journey must have 3-5 steps');
  }

  if (!journey.audience || journey.audience.length === 0) {
    errors.push('Journey must have at least one audience');
  }

  if (!journey.primaryConditions || journey.primaryConditions.length === 0) {
    errors.push('Journey must have at least one primary condition');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
