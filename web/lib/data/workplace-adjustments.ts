// Workplace Adjustments Data
// Reasonable adjustments for autistic employees under Equality Act 2010 (UK) / ADA (US)

export interface WorkplaceAdjustment {
  id: string;
  title: string;
  category: 'environment' | 'communication' | 'workload' | 'social' | 'flexibility';
  description: string;
  howToRequest: string;
  legalBasis: string;
  examples: string[];
  evidence?: string;
}

export const workplaceAdjustments: WorkplaceAdjustment[] = [
  {
    id: 'quiet-workspace',
    title: 'Quiet or Low-Sensory Workspace',
    category: 'environment',
    description: 'Access to a quieter work area, away from high-traffic zones or open-plan noise.',
    howToRequest: 'Email manager/HR: "I am autistic and sensitive to noise. I would benefit from a quieter workspace or permission to work from a meeting room when needed."',
    legalBasis: 'Reasonable adjustment under Equality Act 2010 (UK) / ADA Title I (US)',
    examples: [
      'Desk away from main thoroughfare',
      'Screen or partition around desk',
      'Access to quiet room for focused work',
      'Permission to work from home on high-noise days'
    ],
    evidence: 'Sensory-friendly workplaces improve productivity and reduce stress (NAS Employment Report)'
  },
  {
    id: 'noise-reduction',
    title: 'Noise-Cancelling Equipment',
    category: 'environment',
    description: 'Permission to use noise-cancelling headphones or earplugs during work.',
    howToRequest: 'Request: "I need to wear noise-cancelling headphones to manage sensory input and maintain focus."',
    legalBasis: 'Reasonable adjustment under Equality Act 2010 / ADA',
    examples: [
      'Noise-cancelling headphones provided by employer',
      'Permission to wear earplugs during tasks',
      'White noise machine at desk'
    ]
  },
  {
    id: 'lighting',
    title: 'Adjusted Lighting',
    category: 'environment',
    description: 'Desk lamp instead of overhead fluorescent lighting, or seated away from windows.',
    howToRequest: 'Request: "Fluorescent lighting causes sensory discomfort. May I use a desk lamp instead?"',
    legalBasis: 'Reasonable adjustment under Equality Act 2010 / ADA',
    examples: [
      'Desk lamp with adjustable brightness',
      'Seated away from direct sunlight',
      'Permission to dim overhead lights in office'
    ]
  },
  {
    id: 'written-instructions',
    title: 'Written Instructions & Agendas',
    category: 'communication',
    description: 'Receive meeting agendas in advance and written summaries of verbal instructions.',
    howToRequest: 'Request: "I process information better in writing. Please send meeting agendas 24 hours in advance and follow up verbal instructions by email."',
    legalBasis: 'Reasonable adjustment under Equality Act 2010 / ADA',
    examples: [
      'Meeting agendas sent 24-48 hours before',
      'Email recap of verbal discussions',
      'Written task briefs instead of verbal-only'
    ],
    evidence: 'Clear communication reduces anxiety and errors (ACAS guidance)'
  },
  {
    id: 'no-phone',
    title: 'Alternative to Phone Communication',
    category: 'communication',
    description: 'Email or instant messaging preferred over phone calls where possible.',
    howToRequest: 'Request: "I find phone calls stressful. May I use email or chat for internal communication unless urgent?"',
    legalBasis: 'Reasonable adjustment under Equality Act 2010 / ADA',
    examples: [
      'Email preferred for non-urgent matters',
      'Chat/IM for quick questions',
      'Advance notice for essential phone calls'
    ]
  },
  {
    id: 'task-clarity',
    title: 'Clear Task Instructions',
    category: 'communication',
    description: 'Explicit instructions with deadlines, priorities, and success criteria.',
    howToRequest: 'Request: "I work best with clear expectations. Please provide: task description, deadline, priority level, and what success looks like."',
    legalBasis: 'Reasonable adjustment under Equality Act 2010 / ADA',
    examples: [
      'Written task briefs with acceptance criteria',
      'Numbered priority list',
      'Example of desired output'
    ]
  },
  {
    id: 'flexible-hours',
    title: 'Flexible Working Hours',
    category: 'flexibility',
    description: 'Adjusted start/finish times to avoid peak commuting or manage energy levels.',
    howToRequest: 'Request: "I would benefit from starting at [time] and finishing at [time] to manage my energy and avoid sensory overload on public transport."',
    legalBasis: 'Reasonable adjustment under Equality Act 2010 / ADA / Right to Request Flexible Working',
    examples: [
      'Start 9:30am instead of 9am',
      'Finish at 4pm to avoid rush hour',
      'Compressed hours (e.g., 4 long days)'
    ],
    evidence: 'Flexible hours improve wellbeing and productivity (CIPD research)'
  },
  {
    id: 'hybrid-working',
    title: 'Hybrid or Remote Working',
    category: 'flexibility',
    description: 'Permission to work from home some or all days to manage sensory and social demands.',
    howToRequest: 'Request: "I am more productive in a low-sensory environment. May I work from home [X] days per week?"',
    legalBasis: 'Reasonable adjustment under Equality Act 2010 / ADA',
    examples: [
      'WFH 3 days per week',
      'Fully remote with occasional office days',
      'WFH on high-demand days (e.g., after team meetings)'
    ]
  },
  {
    id: 'regular-breaks',
    title: 'Regular Breaks',
    category: 'workload',
    description: 'Short, frequent breaks to manage sensory input and prevent burnout.',
    howToRequest: 'Request: "I need 10-minute breaks every 90 minutes to manage sensory input and maintain focus."',
    legalBasis: 'Reasonable adjustment under Equality Act 2010 / ADA',
    examples: [
      '10 minutes every 90 minutes',
      'Short walk outside',
      'Quiet room access during breaks'
    ]
  },
  {
    id: 'predictable-routine',
    title: 'Predictable Routine',
    category: 'workload',
    description: 'Advance notice of changes to schedule, tasks, or meetings.',
    howToRequest: 'Request: "I find unexpected changes stressful. Please give at least 24 hours\' notice for schedule changes where possible."',
    legalBasis: 'Reasonable adjustment under Equality Act 2010 / ADA',
    examples: [
      '24-48 hours\' notice for meeting changes',
      'Consistent weekly schedule',
      'Advance warning of office changes (desk moves, visitors)'
    ]
  },
  {
    id: 'limited-meetings',
    title: 'Limited or Structured Meetings',
    category: 'social',
    description: 'Reduced meeting load or permission to attend remotely; clear agendas and roles.',
    howToRequest: 'Request: "I find back-to-back meetings exhausting. May I limit to [X] meetings per day or attend remotely when possible?"',
    legalBasis: 'Reasonable adjustment under Equality Act 2010 / ADA',
    examples: [
      'Max 2 meetings per day',
      'Option to join by video when working from office',
      'Clear role in meeting (listener vs. presenter)'
    ]
  },
  {
    id: 'social-opt-out',
    title: 'Opt-Out from Social Events',
    category: 'social',
    description: 'No pressure to attend non-essential social events (after-work drinks, team lunches).',
    howToRequest: 'Request: "I find large social gatherings draining. I would like to be invited but not expected to attend."',
    legalBasis: 'Reasonable adjustment under Equality Act 2010 / ADA',
    examples: [
      'Invitations without obligation',
      'Alternative 1-to-1 catch-ups',
      'Essential work events scheduled within working hours'
    ]
  },
  {
    id: 'clear-feedback',
    title: 'Clear, Direct Feedback',
    category: 'communication',
    description: 'Explicit feedback without ambiguity or implied criticism.',
    howToRequest: 'Request: "I benefit from direct feedback. Please tell me explicitly what needs to change rather than implying it."',
    legalBasis: 'Reasonable adjustment under Equality Act 2010 / ADA',
    examples: [
      '"This needs to be done by X date" (not "ASAP")',
      '"I need you to change Y" (not "We usually do it this way")',
      'Written feedback where possible'
    ]
  },
  {
    id: 'job-coach',
    title: 'Workplace Mentor or Job Coach',
    category: 'social',
    description: 'Access to a designated colleague for questions or support.',
    howToRequest: 'Request: "I would benefit from a designated mentor or buddy to check in with weekly."',
    legalBasis: 'Reasonable adjustment under Equality Act 2010 / ADA',
    examples: [
      'Weekly check-in with line manager',
      'Buddy system for first 3 months',
      'Access to external job coach (Access to Work funding)'
    ],
    evidence: 'Mentoring improves job retention (NAS employment data)'
  },
  {
    id: 'sensory-tools',
    title: 'Sensory Tools at Desk',
    category: 'environment',
    description: 'Permission to use fidget tools, weighted items, or other sensory supports.',
    howToRequest: 'Request: "I use fidget tools to manage sensory input and maintain focus. Is this acceptable at my desk?"',
    legalBasis: 'Reasonable adjustment under Equality Act 2010 / ADA',
    examples: [
      'Fidget cube or stress ball',
      'Weighted lap pad',
      'Textured items for tactile input'
    ]
  }
];

export function getAdjustmentsByCategory(category: WorkplaceAdjustment['category']): WorkplaceAdjustment[] {
  return workplaceAdjustments.filter(adj => adj.category === category);
}

export const adjustmentCategories = [
  { id: 'environment', label: 'Environment & Sensory', icon: '🏢' },
  { id: 'communication', label: 'Communication', icon: '💬' },
  { id: 'workload', label: 'Workload & Routine', icon: '📋' },
  { id: 'social', label: 'Social Demands', icon: '👥' },
  { id: 'flexibility', label: 'Flexibility', icon: '⏰' }
] as const;
