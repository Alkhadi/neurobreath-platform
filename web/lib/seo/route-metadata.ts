import type { Metadata } from 'next';
import { generatePageMetadata } from './metadata';
import type { PageMetadataConfig } from './metadata';
import { DEFAULT_METADATA, SITE_CONFIG, generateCanonicalUrl } from './site-seo';
import { getRegionAlternates, getRegionFromPath, getRegionKey } from '@/lib/region/region';
import { getIndexingDecision } from '@/lib/seo/indexing-policy';

export interface RouteSeoConfig extends PageMetadataConfig {
  noindex?: boolean;
}

const ROUTE_SEO_CONFIGS: Record<string, RouteSeoConfig> = {
  '/': {
    title: 'NeuroBreath | Evidence-Based Neurodiversity Support',
    description:
      'Evidence-based tools and resources for ADHD, autism, dyslexia and anxiety, plus breathing and focus support for families, teachers and carers across the UK.',
    path: '/',
  },
  '/about-us': {
    title: 'About NeuroBreath | Our Story and Approach',
    description:
      'About NeuroBreath: our story, evidence-led approach and the people behind our neurodiversity resources, breathing tools and learning support.',
    path: '/about-us',
  },
  '/blog': {
    title: 'Neurodiversity & Wellbeing Blog | NeuroBreath',
    description:
      'Research-backed articles on neurodiversity and wellbeing, with practical strategies for ADHD, autism, anxiety, dyslexia and daily resilience.',
    path: '/blog',
  },
  '/coach': {
    title: 'AI Wellbeing Coach | NeuroBreath',
    description:
      'AI wellbeing coach with personalised prompts and evidence-informed guidance for anxiety, ADHD, autism and stress, plus practical next steps.',
    path: '/coach',
  },
  '/contact': {
    title: 'Contact NeuroBreath | Support and Enquiries',
    description:
      'Contact the NeuroBreath team for support, partnerships or feedback. We respond promptly to families, educators and carers across the UK.',
    path: '/contact',
  },
  '/conditions': {
    title: 'Conditions We Cover | NeuroBreath',
    description:
      'A one-stop hub for neurodivergent support resources across ADHD, autism, anxiety, dyslexia, sleep and stress.',
    path: '/conditions',
  },
  '/downloads': {
    title: 'Downloads & Resources | NeuroBreath',
    description:
      'Downloadable guides, worksheets and visual supports for ADHD, autism, dyslexia and anxiety. Practical resources for classrooms and home routines.',
    path: '/downloads',
  },
  '/guides': {
    title: 'Guides | NeuroBreath',
    description:
      'Practical guidance on breathing, focus, sleep and neurodiversity support with clear next steps. Educational information only.',
    path: '/guides',
  },
  '/journeys': {
    title: 'Starter Journeys | NeuroBreath',
    description:
      'Starter journeys that combine guides and tools for calm, focus, sleep and daily support. Educational information only.',
    path: '/journeys',
  },
  '/get-started': {
    title: 'Get Started | NeuroBreath',
    description:
      'Start with a personalised pathway to NeuroBreath tools for ADHD, autism, anxiety and learning support, with simple steps and recommended routines.',
    path: '/get-started',
  },
  '/progress': {
    title: 'Progress Dashboard | NeuroBreath',
    description:
      'Private progress dashboard showing session history, streaks and achievements for registered users. Accessible to authorised accounts only.',
    path: '/progress',
    noindex: true,
  },
  '/resources': {
    title: 'Resources Hub | NeuroBreath',
    description:
      'Library of evidence-based guides, templates and printable supports for ADHD, autism, dyslexia, anxiety and wellbeing in schools and at home.',
    path: '/resources',
  },
  '/printables': {
    title: 'Printables & Templates | NeuroBreath',
    description:
      'Print-friendly templates and checklists for parents, teachers and workplaces. Educational resources only.',
    path: '/printables',
  },
  '/about': {
    title: 'About NeuroBreath | NeuroBreath',
    description:
      'What NeuroBreath is, how it works, and how we keep guidance safe and evidence-informed.',
    path: '/about',
  },
  '/about/mission': {
    title: 'Mission & Values | NeuroBreath',
    description:
      'Why NeuroBreath exists, what we value, and what we do not do.',
    path: '/about/mission',
  },
  '/about/methodology': {
    title: 'Methodology | NeuroBreath',
    description:
      'How NeuroBreath content is written, reviewed, and kept evidence-informed.',
    path: '/about/methodology',
  },
  '/about/who-its-for': {
    title: 'Who It’s For | NeuroBreath',
    description:
      'Who NeuroBreath is designed to help, with recommended journeys, tools, and printables.',
    path: '/about/who-its-for',
  },
  '/about/use-responsibly': {
    title: 'Use Tools Responsibly | NeuroBreath',
    description:
      'How to use NeuroBreath tools safely and within educational boundaries.',
    path: '/about/use-responsibly',
  },
  '/about/how-we-update': {
    title: 'How We Update Content | NeuroBreath',
    description:
      'How NeuroBreath reviews content, what review due means, and how to report updates.',
    path: '/about/how-we-update',
  },
  '/about/faq': {
    title: 'About FAQ | NeuroBreath',
    description:
      'Plain-English answers to common questions about NeuroBreath.',
    path: '/about/faq',
  },
  '/about/language': {
    title: 'Our Language Approach | NeuroBreath',
    description:
      'How NeuroBreath uses neurodiversity-affirming language and respectful framing.',
    path: '/about/language',
  },
  '/editorial': {
    title: 'Editorial Team | NeuroBreath',
    description:
      'Meet the NeuroBreath editorial team and review standards.',
    path: '/editorial',
  },
  '/trust': {
    title: 'Trust Centre | NeuroBreath',
    description:
      'Trust, safety, and evidence standards for NeuroBreath, including safeguarding, privacy, accessibility, and contact routes.',
    path: '/trust',
  },
  '/trust/disclaimer': {
    title: 'Educational Disclaimer | NeuroBreath',
    description:
      'Educational disclaimer explaining what NeuroBreath can and cannot do, and how to use the platform safely.',
    path: '/trust/disclaimer',
  },
  '/trust/evidence-policy': {
    title: 'Evidence Policy | NeuroBreath',
    description:
      'How NeuroBreath selects, reviews, and updates evidence sources for wellbeing and neurodiversity guidance.',
    path: '/trust/evidence-policy',
  },
  '/trust/citations': {
    title: 'Citations & Source Attribution | NeuroBreath',
    description:
      'How NeuroBreath displays citations, verifies sources, and keeps references consistent.',
    path: '/trust/citations',
  },
  '/trust/editorial-standards': {
    title: 'Editorial Standards | NeuroBreath',
    description:
      'Editorial standards for tone, evidence claims, localisation, and content quality on NeuroBreath.',
    path: '/trust/editorial-standards',
  },
  '/trust/safeguarding': {
    title: 'Safeguarding Guidance | NeuroBreath',
    description:
      'Safeguarding guidance with reporting routes and urgent support information for UK and US users.',
    path: '/trust/safeguarding',
  },
  '/trust/accessibility': {
    title: 'Accessibility Statement | NeuroBreath',
    description:
      'Accessibility statement outlining our WCAG-aligned commitments, known limitations, and how to report issues.',
    path: '/trust/accessibility',
  },
  '/trust/privacy': {
    title: 'Privacy Notice (Plain Language) | NeuroBreath',
    description:
      'Plain-language privacy notice explaining how NeuroBreath handles data and user choices.',
    path: '/trust/privacy',
  },
  '/trust/last-reviewed': {
    title: 'Last Reviewed & Content Freshness | NeuroBreath',
    description:
      'How NeuroBreath reviews content, update cadences, and content freshness summaries.',
    path: '/trust/last-reviewed',
  },
  '/trust/terms': {
    title: 'Terms of Use | NeuroBreath',
    description:
      'Basic terms of use and acceptable use guidelines for the NeuroBreath platform.',
    path: '/trust/terms',
  },
  '/trust/contact': {
    title: 'Contact & Report Concerns | NeuroBreath',
    description:
      'Contact NeuroBreath for support, feedback, or to report safeguarding and content concerns.',
    path: '/trust/contact',
  },
  '/rewards': {
    title: 'Rewards & Badges | NeuroBreath',
    description:
      'Reward badges, streaks and milestones designed to reinforce practice habits, celebrate progress and boost motivation for learners of all ages.',
    path: '/rewards',
  },
  '/schools': {
    title: 'NeuroBreath for Schools | SEND Support',
    description:
      'SEND-friendly tools for schools, with breathing and focus activities plus guidance for supporting neurodiverse learners in UK classrooms.',
    path: '/schools',
  },
  '/send-report': {
    title: 'SEND Reports | NeuroBreath',
    description:
      'Create and manage SEND training recommendation reports for learners, with summaries and evidence links. Not a diagnostic tool.',
    path: '/send-report',
    noindex: true,
  },
  '/sleep': {
    title: 'Sleep Support Tools | NeuroBreath',
    description:
      'Sleep support tools with wind‑down routines, breathing timers and calming prompts to build consistent, restorative rest.',
    path: '/sleep',
  },
  '/stress': {
    title: 'Stress Support Tools | NeuroBreath',
    description:
      'Stress support resources including breathing, grounding and planning tools to reduce overwhelm and build steady day‑to‑day resilience.',
    path: '/stress',
  },
  '/support-us': {
    title: 'Support NeuroBreath | Help Our Mission',
    description:
      'Support NeuroBreath’s mission to deliver free, evidence-based neurodiversity tools through partnerships, sponsorship or sharing feedback.',
    path: '/support-us',
  },
  '/teacher-quick-pack': {
    title: 'Teacher Quick Pack | NeuroBreath',
    description:
      'Quick-start pack for teachers with classroom strategies, breathing tools and printable supports for neurodiverse learners.',
    path: '/teacher-quick-pack',
  },
  '/teacher/dashboard': {
    title: 'Teacher Dashboard | NeuroBreath',
    description:
      'Private teacher dashboard to review learner activity, trends and classroom progress summaries, with read‑only analytics for secure access.',
    path: '/teacher/dashboard',
    noindex: true,
  },
  '/tools': {
    title: 'Interactive Tools | NeuroBreath',
    description:
      'Interactive tools for ADHD, autism, anxiety and dyslexia, including breathing, focus games, mood tracking and routines for everyday support.',
    path: '/tools',
  },
  '/breathing': {
    title: 'Breathing Exercises for Calm & Focus | NeuroBreath',
    description:
      'Breathing exercises for calm, focus and sleep with step-by-step guides, timers and audio cues. Evidence-informed techniques for daily use.',
    path: '/breathing',
  },
  '/breathing/breath': {
    title: 'Breathing Basics | NeuroBreath',
    description:
      'How‑to guide to basic breathing technique, posture and pacing, with simple practice steps to build calm and body awareness.',
    path: '/breathing/breath',
  },
  '/breathing/focus': {
    title: 'Focus Breathing | NeuroBreath',
    description:
      'Focus training with short sprints, recovery breaks and breathing cues to steady attention, reduce mental fatigue and build sustainable study routines.',
    path: '/breathing/focus',
  },
  '/breathing/mindfulness': {
    title: 'Mindfulness Breathing | NeuroBreath',
    description:
      'Mindfulness breathing guide with short practices to anchor attention, ease stress and build everyday resilience, ideal for quick resets.',
    path: '/breathing/mindfulness',
  },
  '/breathing/techniques/sos-60': {
    title: '60‑Second SOS Breathing | NeuroBreath',
    description:
      '60‑second SOS breathing for rapid calming during stress or panic. Quick setup, pacing and grounding prompts for immediate relief.',
    path: '/breathing/techniques/sos-60',
  },
  '/breathing/training/focus-garden': {
    title: 'Focus Garden Training | NeuroBreath',
    description:
      'Focus Garden training combines breathing, attention cues and gentle progress tracking to help build steady focus over time.',
    path: '/breathing/training/focus-garden',
  },
  '/techniques/4-7-8': {
    title: '4‑7‑8 Breathing Technique | NeuroBreath',
    description:
      '4‑7‑8 breathing technique guide for relaxation and sleep. Counted pacing, timing tips and a calm routine you can repeat daily.',
    path: '/techniques/4-7-8',
  },
  '/techniques/box-breathing': {
    title: 'Box Breathing Technique | NeuroBreath',
    description:
      'Box breathing guide for steady focus and emotional regulation. Four-count rhythm with pacing tips for stress relief and clarity.',
    path: '/techniques/box-breathing',
  },
  '/techniques/coherent': {
    title: 'Coherent Breathing Technique | NeuroBreath',
    description:
      'Coherent breathing at a slow, steady pace to support heart rate variability and nervous system balance, with simple timing cues.',
    path: '/techniques/coherent',
  },
  '/techniques/sos': {
    title: '60‑Second SOS Breathing | NeuroBreath',
    description:
      '60‑second SOS breathing guide for quick calm, with clear steps, pacing and grounding prompts to reset the body during acute stress.',
    path: '/techniques/sos',
  },
  '/adhd': {
    title: 'ADHD Support Hub | NeuroBreath',
    description:
      'Comprehensive ADHD support hub with focus tools, routines and evidence-based strategies for children, parents, teachers and carers in the UK.',
    path: '/adhd',
  },
  '/anxiety': {
    title: 'Anxiety Support Hub | NeuroBreath',
    description:
      'Evidence-based anxiety tools including breathing, grounding, CBT prompts and progress tracking to help build calm and resilience.',
    path: '/anxiety',
  },
  '/autism': {
    title: 'Autism Support Hub | NeuroBreath',
    description:
      'Evidence-based autism support with visual schedules, sensory strategies and practical tools for families, educators and autistic people.',
    path: '/autism',
  },
  '/autism/focus-garden': {
    title: 'Focus Garden | Autism Support | NeuroBreath',
    description:
      'Focus Garden offers calm, structured attention practice for autistic learners with visual cues, predictable routines and gentle pacing.',
    path: '/autism/focus-garden',
  },
  '/conditions/adhd-carer': {
    title: 'ADHD Carer Support | NeuroBreath',
    description:
      'ADHD guidance for carers with routines, communication tips and wellbeing support to help manage daily life and build consistency.',
    path: '/conditions/adhd-carer',
  },
  '/conditions/adhd-parent': {
    title: 'ADHD Parent Support | NeuroBreath',
    description:
      'ADHD support for parents with home routines, positive behaviour strategies and school collaboration tools for confident learning.',
    path: '/conditions/adhd-parent',
  },
  '/conditions/adhd-teacher': {
    title: 'ADHD Teacher Support | NeuroBreath',
    description:
      'ADHD classroom support with practical adjustments, focus strategies and behaviour guidance aligned with UK SEND practice.',
    path: '/conditions/adhd-teacher',
  },
  '/conditions/anxiety': {
    title: 'Anxiety Support Guide | NeuroBreath',
    description:
      'Anxiety support guide with coping strategies, calming techniques and practical routines for everyday wellbeing.',
    path: '/conditions/anxiety',
  },
  '/conditions/anxiety-carer': {
    title: 'Anxiety Carer Support | NeuroBreath',
    description:
      'Support for carers of people with anxiety, including calm routines, communication tips and guidance on when to seek help.',
    path: '/conditions/anxiety-carer',
  },
  '/conditions/anxiety-parent': {
    title: 'Anxiety Parent Support | NeuroBreath',
    description:
      'Support for parents helping a child with anxiety, with routines, reassurance techniques and school‑friendly strategies that build confidence.',
    path: '/conditions/anxiety-parent',
  },
  '/conditions/autism': {
    title: 'Autism Support Guide | NeuroBreath',
    description:
      'Autism support guide with communication strategies, sensory considerations and practical routines for home and school.',
    path: '/conditions/autism',
  },
  '/conditions/autism-carer': {
    title: 'Autism Carer Support | NeuroBreath',
    description:
      'Autism support for carers with daily‑living strategies, sensory tools and guidance for consistent, respectful care across settings.',
    path: '/conditions/autism-carer',
  },
  '/conditions/autism-parent': {
    title: 'Autism Parent Support | NeuroBreath',
    description:
      'Autism support for parents with communication tools, sensory strategies and routines that build confidence at home and school.',
    path: '/conditions/autism-parent',
  },
  '/conditions/autism-teacher': {
    title: 'Autism Teacher Support | NeuroBreath',
    description:
      'Autism classroom guidance with inclusive strategies, visual supports and practical adjustments for neurodiverse learners.',
    path: '/conditions/autism-teacher',
  },
  '/conditions/bipolar': {
    title: 'Bipolar Disorder Support | NeuroBreath',
    description:
      'Bipolar disorder support guide with clear explanations, treatment overview and resources for individuals, families and educators.',
    path: '/conditions/bipolar',
  },
  '/conditions/depression': {
    title: 'Depression Support Guide | NeuroBreath',
    description:
      'Depression support guide with evidence-based coping tools, routines and resources for individuals and those who support them.',
    path: '/conditions/depression',
  },
  '/conditions/dyslexia': {
    title: 'Dyslexia Support Hub | NeuroBreath',
    description:
      'Dyslexia support hub with reading strategies, classroom tips and resources for learners, parents, teachers and carers, focused on confidence.',
    path: '/conditions/dyslexia',
  },
  '/conditions/dyslexia-carer': {
    title: 'Dyslexia Carer Support | NeuroBreath',
    description:
      'Dyslexia support for carers with daily routines, communication tips and wellbeing guidance for people of all ages, including adults.',
    path: '/conditions/dyslexia-carer',
  },
  '/conditions/dyslexia-parent': {
    title: 'Dyslexia Parent Support | NeuroBreath',
    description:
      'Dyslexia support for parents with home reading routines, school collaboration tips and practical resources for confidence.',
    path: '/conditions/dyslexia-parent',
  },
  '/conditions/dyslexia-teacher': {
    title: 'Dyslexia Teacher Support | NeuroBreath',
    description:
      'Dyslexia classroom support with evidence-based strategies, assessment tools and inclusive teaching resources to improve literacy and access.',
    path: '/conditions/dyslexia-teacher',
  },
  '/conditions/low-mood-burnout': {
    title: 'Low Mood & Burnout Support | NeuroBreath',
    description:
      'Support for low mood and burnout with gentle activation ideas, stress‑recovery routines and practical coping tools to rebuild momentum.',
    path: '/conditions/low-mood-burnout',
  },
  '/conditions/mood': {
    title: 'Mood Support Tools | NeuroBreath',
    description:
      'Mood tools and guidance for tracking patterns, building routines and supporting emotional regulation in daily life with gentle prompts.',
    path: '/conditions/mood',
  },
  '/dyslexia-reading-training': {
    title: 'Dyslexia Reading Training | NeuroBreath',
    description:
      'Multisensory dyslexia reading training with phonics, fluency practice and comprehension support for learners, parents and teachers.',
    path: '/dyslexia-reading-training',
  },
  '/tools/adhd-deep-dive/assessment': {
    title: 'ADHD Assessment Guide | NeuroBreath',
    description:
      'Step-by-step guide to getting an ADHD assessment in the UK, including referral routes, evidence to gather and what to expect in clinic.',
    path: '/tools/adhd-deep-dive/assessment',
  },
  '/tools/adhd-deep-dive/diagnosis': {
    title: 'ADHD Diagnosis Decisions | NeuroBreath',
    description:
      'Understand ADHD diagnosis decisions with clear explanations of criteria, common questions and how outcomes guide support at home and school.',
    path: '/tools/adhd-deep-dive/diagnosis',
  },
  '/tools/adhd-deep-dive/helplines': {
    title: 'ADHD Helplines & Support | NeuroBreath',
    description:
      'UK helplines, crisis options and community organisations for ADHD families, with quick steps for urgent support and ongoing guidance.',
    path: '/tools/adhd-deep-dive/helplines',
  },
  '/tools/adhd-deep-dive/self-care': {
    title: 'ADHD Parent & Carer Self‑Care | NeuroBreath',
    description:
      'Self‑care guidance for ADHD parents and carers, covering burnout prevention, stress resets and ways to protect your energy.',
    path: '/tools/adhd-deep-dive/self-care',
  },
  '/tools/adhd-deep-dive/support-at-home': {
    title: 'ADHD Support at Home | NeuroBreath',
    description:
      'Practical ADHD support at home: routines, reward systems, focus‑friendly spaces and communication tips that work in daily life.',
    path: '/tools/adhd-deep-dive/support-at-home',
  },
  '/tools/adhd-deep-dive/teens': {
    title: 'ADHD Support for Teens | NeuroBreath',
    description:
      'Support for ADHD teens with study planning, motivation tools, emotional regulation and healthy routines for school and life.',
    path: '/tools/adhd-deep-dive/teens',
  },
  '/tools/adhd-deep-dive/what-is-adhd': {
    title: 'What Is ADHD? | NeuroBreath',
    description:
      'Clear explanation of what ADHD is and isn’t, covering core traits, common myths and how it can present across ages at home and school.',
    path: '/tools/adhd-deep-dive/what-is-adhd',
  },
  '/tools/adhd-deep-dive/working-with-school': {
    title: 'ADHD Support at School | NeuroBreath',
    description:
      'How to work with schools on ADHD support, including SEND plans, adjustments and effective home–school communication to sustain progress.',
    path: '/tools/adhd-deep-dive/working-with-school',
  },
  '/tools/adhd-deep-dive/young-people': {
    title: 'ADHD for Young People & Adults | NeuroBreath',
    description:
      'ADHD guidance for young people and adults, with coping strategies, workplace tips and routes to further support for daily life.',
    path: '/tools/adhd-deep-dive/young-people',
  },
  '/tools/adhd-focus-lab': {
    title: 'ADHD Focus Lab | NeuroBreath',
    description:
      'ADHD Focus Lab provides short games, breathing cues and journalling to practise attention in low‑pressure sessions and build insight.',
    path: '/tools/adhd-focus-lab',
  },
  '/tools/adhd-tools': {
    title: 'ADHD Tools & Focus Hub | NeuroBreath',
    description:
      'ADHD tools including focus timers, routines, reward systems and planning supports to help manage attention and executive function.',
    path: '/tools/adhd-tools',
  },
  '/tools/anxiety-tools': {
    title: 'Anxiety Toolkit | NeuroBreath',
    description:
      'Anxiety toolkit with breathing, grounding, CBT prompts and mood tracking to build calm, reduce worry and strengthen coping skills.',
    path: '/tools/anxiety-tools',
  },
  '/tools/autism-tools': {
    title: 'Autism Tools & Support Hub | NeuroBreath',
    description:
      'Autism support tools including visual schedules, sensory calming activities and communication aids for home and school, built for routine.',
    path: '/tools/autism-tools',
  },
  '/tools/breath-ladder': {
    title: 'Breath Ladder | NeuroBreath',
    description:
      'Breath Ladder trains gradual pacing and lung control with step-by-step levels, helping users build calm and concentration.',
    path: '/tools/breath-ladder',
  },
  '/tools/breath-tools': {
    title: 'Breath Tools & Timers | NeuroBreath',
    description:
      'Breath tools and timers for calm, focus and sleep, with guided cues and accessible practice options for home and classrooms.',
    path: '/tools/breath-tools',
  },
  '/tools/colour-path': {
    title: 'Colour‑Path Breathing | NeuroBreath',
    description:
      'Colour‑Path breathing uses visual tracing and paced prompts to support calm, focus and sensory regulation, ideal for short resets.',
    path: '/tools/colour-path',
  },
  '/tools/depression-tools': {
    title: 'Depression Support Tools | NeuroBreath',
    description:
      'Depression support tools for low mood, including gentle activation prompts, routine builders and coping resources to support momentum.',
    path: '/tools/depression-tools',
  },
  '/tools/focus-tiles': {
    title: 'Focus Tiles | NeuroBreath',
    description:
      'Focus Tiles delivers short attention games and prompts to build concentration, task-starting momentum and positive study habits.',
    path: '/tools/focus-tiles',
  },
  '/tools/focus-training': {
    title: 'Focus Training | NeuroBreath',
    description:
      'Focus training with paced sprints, breathing cues and recovery breaks to build sustainable attention for work and study.',
    path: '/tools/focus-training',
  },
  '/tools/mood-tools': {
    title: 'Mood Tools | NeuroBreath',
    description:
      'Mood tools for tracking, reflection and regulation, including check-ins, journalling and grounding prompts for emotional balance.',
    path: '/tools/mood-tools',
  },
  '/tools/roulette': {
    title: 'Micro‑Reset Roulette | NeuroBreath',
    description:
      'Micro‑Reset Roulette offers quick wellbeing breaks, breathing and movement prompts to reduce overwhelm and restore attention in minutes.',
    path: '/tools/roulette',
  },
  '/tools/sleep-tools': {
    title: 'Sleep Tools | NeuroBreath',
    description:
      'Sleep tools with wind‑down routines, breathing timers and calming prompts to support better rest and steady bedtime habits.',
    path: '/tools/sleep-tools',
  },
  '/tools/stress-tools': {
    title: 'Stress Tools | NeuroBreath',
    description:
      'Stress tools including breathing, grounding and prioritisation prompts to reduce overwhelm, steady focus and support daily resilience.',
    path: '/tools/stress-tools',
  },
};

export function getRouteSeoConfig(pathname: string): RouteSeoConfig | null {
  const cleanedPath = pathname.replace(/^\/(uk|us)/, '') || '/';
  const exactMatch = ROUTE_SEO_CONFIGS[cleanedPath];
  if (exactMatch) {
    return exactMatch;
  }

  if (cleanedPath.startsWith('/parent/')) {
    return {
      title: 'Parent View | NeuroBreath',
      description:
        'Read-only progress view for parents and carers, with secure access to session summaries, achievements and routines for the learner code provided.',
      path: cleanedPath,
      noindex: true,
    };
  }

  return null;
}

export function getRouteMetadata(pathname: string): Metadata {
  const region = getRegionFromPath(pathname);
  const regionKey = getRegionKey(region);
  const cleanedPath = pathname.replace(/^\/(uk|us)/, '') || '/';
  const config = getRouteSeoConfig(pathname);
  const isLocalized = cleanedPath === '/' || cleanedPath.startsWith('/trust') || cleanedPath.startsWith('/guides');
  const indexingDecision = getIndexingDecision(cleanedPath);
  const shouldIndex = indexingDecision.index;

  if (!config) {
    const canonicalPath = isLocalized
      ? `/${regionKey}${cleanedPath === '/' ? '' : cleanedPath}`
      : cleanedPath;
    const alternates = getRegionAlternates(cleanedPath);
    return {
      ...DEFAULT_METADATA,
      robots: shouldIndex
        ? DEFAULT_METADATA.robots
        : {
            index: false,
            follow: false,
          },
      alternates: {
        canonical: generateCanonicalUrl(canonicalPath),
        ...(isLocalized
          ? {
              languages: {
                'en-GB': generateCanonicalUrl(alternates['en-GB']),
                'en-US': generateCanonicalUrl(alternates['en-US']),
              },
            }
          : {}),
      },
    };
  }

  const metadata = generatePageMetadata({
    title: config.title,
    description: config.description,
    path: isLocalized ? `/${regionKey}${config.path === '/' ? '' : config.path}` : config.path,
    keywords: config.keywords,
    image: config.image || SITE_CONFIG.defaultOGImage,
    noindex: config.noindex || !shouldIndex,
  });

  const alternates = getRegionAlternates(config.path);
  return {
    ...metadata,
    alternates: {
      canonical: metadata.alternates?.canonical || generateCanonicalUrl(isLocalized ? `/${regionKey}${config.path}` : config.path),
      ...(isLocalized
        ? {
            languages: {
              'en-GB': generateCanonicalUrl(alternates['en-GB']),
              'en-US': generateCanonicalUrl(alternates['en-US']),
            },
          }
        : {}),
    },
  };
}
