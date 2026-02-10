import type { RelatedContentItem, FAQItem } from '@/lib/seo/content-seo';

export interface InteractiveGuide {
  slug: string;
  title: string;
  description: string;
  pillar: {
    label: string;
    href: string;
  };
  intro: string;
  steps: string[];
  practicalTips: string[];
  safetyNotes?: string[];
  tryNow: {
    label: string;
    href: string;
  };
  related: RelatedContentItem[];
  faqs: FAQItem[];
  evidenceIds: string[];
  reviewedAt: string;
  nextReviewDue: string;
}

export const INTERACTIVE_GUIDES: InteractiveGuide[] = [
  {
    slug: 'quick-calm-in-5-minutes',
    title: 'Quick calm in 5 minutes',
    description: 'A short, practical reset using breathing, grounding, and gentle movement.',
    pillar: { label: 'Stress & Calm Support', href: '/stress' },
    intro:
      'When stress builds up, a brief structured reset can help the body and mind settle. This 5-minute routine combines breathing, grounding (the 5-4-3-2-1 method), gentle movement, and a micro-planning step to reduce overwhelm. It is not a substitute for professional support but can help you regain a sense of steadiness in everyday moments.',
    steps: [
      'Find a comfortable seat or stand with feet flat on the floor.',
      'Start with 60 seconds of gentle paced breathing (in for 4, out for 6).',
      'Use the 5-4-3-2-1 grounding method: name 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste.',
      'Gently roll your shoulders, unclench your jaw, stretch your neck from side to side.',
      'Return to slow breathing for another 60 seconds.',
      'Finish by naming the smallest next step you can take.',
    ],
    practicalTips: [
      'If you feel light-headed, slow the exhale and pause for a moment.',
      'Repeat this routine before meetings, exams, or transitions.',
      'Keep it brief — consistency matters more than duration.',
      'If one step feels unhelpful, skip it and move to the next.',
      'You do not need a quiet space; this can be done at a desk or in a car park (not while driving).',
    ],
    safetyNotes: [
      'Do not use this while driving or operating machinery.',
      'Stop and return to normal breathing if you feel panicky or dizzy.',
      'This routine is for everyday stress, not crisis moments. If you feel unsafe, contact a professional or emergency service.',
      'If grounding makes you feel worse, try focusing on your hands and feet only.',
    ],
    tryNow: {
      label: 'Open Stress Tools',
      href: '/tools/stress-tools',
    },
    related: [
      {
        href: '/tools/stress-tools',
        label: 'Stress Tools',
        description: 'Breathing, grounding, and tracking in one hub.',
        typeBadge: 'Tool',
      },
      {
        href: '/breathing/techniques/sos-60',
        label: 'SOS 60 Setup',
        description: 'Fast breathing routine for acute stress.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/body-scan-for-stress',
        label: 'Body scan for stress relief',
        description: 'A simple body scan to release tension.',
        typeBadge: 'Guide',
      },
      {
        href: '/techniques/coherent',
        label: 'Coherent Breathing',
        description: 'Slow, steady rhythm for longer practice.',
        typeBadge: 'Technique',
      },
    ],
    faqs: [
      {
        question: 'Can I use this routine during a panic spike?',
        answer: 'It can help you slow down, but seek professional support if panic is frequent or severe.',
      },
      {
        question: 'Should I sit or stand?',
        answer: 'Either is fine. Choose a posture that feels stable and safe.',
      },
      {
        question: 'How often should I repeat this?',
        answer: 'Use it as needed and consider a short daily practice for prevention.',
      },
      {
        question: 'What if grounding makes me feel worse?',
        answer: 'Focus on hands and feet only, or switch to a simple slow exhale. Not all techniques suit everyone.',
      },
      {
        question: 'Is this based on evidence?',
        answer: 'Grounding (5-4-3-2-1) and paced breathing are supported by clinical guidance. See evidence sources below.',
      },
    ],
    evidenceIds: [
      'nhs_inform_grounding',
      'nhs_mindfulness',
      'nhs_breathing_stress',
      'pubmed_29616846',
    ],
    reviewedAt: '28 Jan 2026',
    nextReviewDue: '28 May 2026',
  },
  {
    slug: 'body-scan-for-stress',
    title: 'Body scan for stress relief',
    description: 'A simple body scan to release tension and reset your attention.',
    pillar: { label: 'Stress & Calm Support', href: '/stress' },
    intro:
      'A body scan is a mindfulness-based practice where you focus attention on different parts of the body, noticing tension and gently letting it go. It can help with stress, improve body awareness, and support relaxation. However, body scans are not helpful for everyone — some people find them uncomfortable or triggering. That is completely normal, and other approaches (like grounding) may suit you better.',
    steps: [
      'Find a comfortable position — sitting or lying down.',
      'Close your eyes or soften your gaze.',
      'Start at your feet and ankles. Notice any tension and let it soften.',
      'Move attention up to your legs, then torso, then shoulders and arms.',
      'Scan your face and jaw — release any clenching.',
      'Finish with a slow breath, noticing your whole body at rest.',
    ],
    practicalTips: [
      'If scanning feels difficult, try one area at a time (just hands, or just feet).',
      'Pair the scan with a short breathing timer.',
      'Use the scan before sleep or after a stressful event.',
      'Keep your eyes open if closing them feels unsettling.',
      'The NHS Every Mind Matters website includes audio guides for body scans.',
    ],
    safetyNotes: [
      'Body scans involve inward attention, which is not comfortable for everyone.',
      'If you feel panicky or distressed, stop and try grounding (5-4-3-2-1) instead.',
      'If you have experienced trauma, consult a professional before using body awareness techniques.',
      'This is educational guidance, not therapy.',
    ],
    tryNow: {
      label: 'Open Stress Tools',
      href: '/tools/stress-tools',
    },
    related: [
      {
        href: '/tools/anxiety-tools',
        label: 'Anxiety Toolkit',
        description: 'Grounding and calming prompts.',
        typeBadge: 'Tool',
      },
      {
        href: '/guides/quick-calm-in-5-minutes',
        label: 'Quick calm in 5 minutes',
        description: 'Short reset routine for busy days.',
        typeBadge: 'Guide',
      },
      {
        href: '/techniques/coherent',
        label: 'Coherent Breathing',
        description: 'Slow, steady rhythm for balance.',
        typeBadge: 'Technique',
      },
      {
        href: '/tools/stress-tools',
        label: 'Stress Tools',
        description: 'Breathing, grounding, and tracking.',
        typeBadge: 'Tool',
      },
    ],
    faqs: [
      {
        question: 'Is a body scan the same as meditation?',
        answer: 'It is a simple mindful practice, but you do not need to meditate to use it.',
      },
      {
        question: 'Can I do this at my desk?',
        answer: 'Yes, it can be done sitting down with minimal movement.',
      },
      {
        question: 'How long should it take?',
        answer: 'Start with 2–3 minutes and extend if it feels useful.',
      },
      {
        question: 'What if body scans make me feel worse?',
        answer: 'Not all approaches work for everyone. Try grounding or breathing exercises instead.',
      },
      {
        question: 'Is there evidence for body scans?',
        answer: 'Research shows body scans can reduce stress for many people, but effects vary. NHS guidance includes them as a beginner mindfulness practice.',
      },
      {
        question: 'Should I use audio guidance?',
        answer: 'Audio guides can help you stay focused. NHS Every Mind Matters offers free body scan audio.',
      },
    ],
    evidenceIds: [
      'nhs_every_mind_matters_meditation',
      'nhs_mindfulness',
      'pubmed_body_scan_2022',
    ],
    reviewedAt: '28 Jan 2026',
    nextReviewDue: '28 May 2026',
  },
];

export const INTERACTIVE_GUIDES_MAP = new Map(INTERACTIVE_GUIDES.map(guide => [guide.slug, guide]));
