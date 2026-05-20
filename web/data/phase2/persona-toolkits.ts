export type ToolkitCard = {
  id: string;
  title: string;
  description: string;
  href?: string;
};

export type ToolkitSection = {
  id: string;
  heading: string;
  cards: ToolkitCard[];
};

export type PersonaToolkit = {
  slug: 'parents' | 'educators' | 'paediatricians' | 'professionals';
  title: string;
  audience: string;
  intro: string;
  startHere: ToolkitCard[];
  mostUseful: ToolkitCard[];
  commonSituations: ToolkitCard[];
  templates: ToolkitCard[];
};

export const TOOLKITS: PersonaToolkit[] = [
  {
    slug: 'parents',
    title: 'Parent Toolkit',
    audience: 'For parents and carers supporting a neurodivergent child or teen.',
    intro:
      'Practical, calm starting points for daily routines, school conversations, and home support. Educational guidance only.',
    startHere: [
      { id: 'p-start-1', title: 'Begin with a calm routine', description: 'Pick one anchor routine and keep it predictable for two weeks.' },
      { id: 'p-start-2', title: 'Identify the biggest daily stressor', description: 'Choose one situation to support first, not everything at once.' },
    ],
    mostUseful: [
      { id: 'p-tool-1', title: 'Morning routine support', description: 'Reduce decisions and add visible cues for transitions.' },
      { id: 'p-tool-2', title: 'Sleep wind-down routine', description: 'Calm lighting, lower noise, and predictable steps before bed.' },
      { id: 'p-tool-3', title: 'Sensory overload plan', description: 'Recognise early signs and have a quiet reset ready.' },
      { id: 'p-tool-4', title: 'Reading support at home', description: 'Short paired-reading sessions with breaks.', href: '/dyslexia-reading-training' },
    ],
    commonSituations: [
      { id: 'p-sit-1', title: 'Homework battles', description: 'Shorten the session, add movement breaks, and lower the demand.' },
      { id: 'p-sit-2', title: 'Meltdown recovery', description: 'Stay nearby, lower input, and re-connect before discussing.' },
      { id: 'p-sit-3', title: 'School meeting preparation', description: 'Write one barrier, one example, and one request before going in.' },
    ],
    templates: [
      { id: 'p-tpl-1', title: 'School support meeting request', description: 'See the Legal Rights Hub for a copyable template.', href: '/rights/access-to-work' },
      { id: 'p-tpl-2', title: 'When to seek professional advice', description: 'If safety is a concern, contact an appropriate qualified professional.' },
    ],
  },
  {
    slug: 'educators',
    title: 'Educator Toolkit',
    audience: 'For teachers and learning-support staff.',
    intro:
      'Neuro-affirming classroom routines and short, practical strategies. Educational guidance only.',
    startHere: [
      { id: 'e-start-1', title: 'Pick one routine to make predictable', description: 'Start with the start-of-lesson or end-of-day routine.' },
      { id: 'e-start-2', title: 'Reduce instruction load', description: 'Give one clear instruction at a time, plus a written cue.' },
    ],
    mostUseful: [
      { id: 'e-tool-1', title: 'Neuroinclusive classroom routines', description: 'Predictable structure, visible cues, calm transitions.' },
      { id: 'e-tool-2', title: 'Clear instruction checklist', description: 'One step, one sentence, one written prompt.' },
      { id: 'e-tool-3', title: 'Calm classroom reset', description: 'Short reset routine when energy or noise builds up.' },
      { id: 'e-tool-4', title: 'Supporting dyslexia-friendly reading', description: 'Spacing, audio support, and short reading sprints.' },
    ],
    commonSituations: [
      { id: 'e-sit-1', title: 'A student who cannot start', description: 'Co-write the first step together rather than redirecting from a distance.' },
      { id: 'e-sit-2', title: 'Group work overload', description: 'Offer a quieter alternative or a defined role.' },
      { id: 'e-sit-3', title: 'Communicating with parents/carers', description: 'Share the strategy used in class so it can be mirrored at home.' },
    ],
    templates: [
      { id: 'e-tpl-1', title: 'Supportive classroom plan', description: 'Write one barrier, one accommodation, one review date.' },
      { id: 'e-tpl-2', title: 'Referral-support notes', description: 'Use plain-language signposting and avoid diagnostic language.' },
    ],
  },
  {
    slug: 'paediatricians',
    title: 'Paediatrician Toolkit',
    audience: 'For paediatricians and family-health professionals signposting families.',
    intro:
      'Plain-language signposting, non-diagnostic NeuroBreath tools, and family support conversations. Educational guidance only.',
    startHere: [
      { id: 'pd-start-1', title: 'Plain-language signposting', description: 'Use non-diagnostic language when introducing NeuroBreath tools.' },
      { id: 'pd-start-2', title: 'Confirm what the family is seeking', description: 'Information, strategies, or onward referral.' },
    ],
    mostUseful: [
      { id: 'pd-tool-1', title: 'Family support conversations', description: 'Short, respectful framing for first conversations.' },
      { id: 'pd-tool-2', title: 'Non-diagnostic NeuroBreath tools', description: 'Routines, sensory resets, sleep wind-down, focus sprints.' },
      { id: 'pd-tool-3', title: 'Sleep, stress, and routines', description: 'Educational resources to support daily functioning.' },
      { id: 'pd-tool-4', title: 'Emotional-regulation resources', description: 'Short, calm techniques families can practise at home.' },
    ],
    commonSituations: [
      { id: 'pd-sit-1', title: 'Family worried about school', description: 'Signpost the Educator Toolkit and Access to Work / Rights Hub for older teens.' },
      { id: 'pd-sit-2', title: 'Sleep concerns', description: 'Share calm wind-down routines and review consistency over two weeks.' },
      { id: 'pd-sit-3', title: 'Sensory concerns at home', description: 'Discuss low-stimulation reset spaces and predictable transitions.' },
    ],
    templates: [
      { id: 'pd-tpl-1', title: 'Referral-support notes', description: 'Stay within scope of practice and respect professional boundaries.' },
      { id: 'pd-tpl-2', title: 'Safety and professional boundaries', description: 'For urgent or clinical risk, follow your standard escalation pathway.' },
    ],
  },
  {
    slug: 'professionals',
    title: 'Professional Toolkit',
    audience: 'For neurodivergent professionals and supportive colleagues.',
    intro:
      'Practical work-day tools and self-advocacy resources. Educational guidance only.',
    startHere: [
      { id: 'pr-start-1', title: 'Pick one focus routine', description: 'Short sprint plus a planned recovery break.' },
      { id: 'pr-start-2', title: 'Notice one repeating barrier', description: 'Write it down and pick one adjustment to try.' },
    ],
    mostUseful: [
      { id: 'pr-tool-1', title: 'Workplace adjustment checklist', description: 'Identify the barrier, the example, and the request.' },
      { id: 'pr-tool-2', title: 'Focus routine starter', description: 'Short sprints with deliberate recovery.' },
      { id: 'pr-tool-3', title: 'Meeting preparation support', description: 'Agenda in advance, one question prepared, notes after.' },
      { id: 'pr-tool-4', title: 'Burnout and stress reset', description: 'Lower the demand, take recovery time, review the load.' },
    ],
    commonSituations: [
      { id: 'pr-sit-1', title: 'Asking for an adjustment', description: 'Use a copyable template from the Legal Rights Hub.', href: '/rights/access-to-work' },
      { id: 'pr-sit-2', title: 'High-stimulation week', description: 'Plan recovery time before, during, and after.' },
      { id: 'pr-sit-3', title: 'Difficult conversations', description: 'Prepare one calm sentence and one question.' },
    ],
    templates: [
      { id: 'pr-tpl-1', title: 'Access to Work preparation', description: 'See the Rights Hub for a checklist and templates.', href: '/rights/access-to-work' },
      { id: 'pr-tpl-2', title: 'Communication template', description: 'Plain, calm, specific. One barrier, one example, one request.' },
    ],
  },
];

export function getToolkit(slug: PersonaToolkit['slug']): PersonaToolkit {
  const found = TOOLKITS.find((t) => t.slug === slug);
  if (!found) {
    throw new Error(`Unknown toolkit slug: ${slug}`);
  }
  return found;
}
