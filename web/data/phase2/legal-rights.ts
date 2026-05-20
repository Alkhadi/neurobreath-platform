export type RightsTemplate = {
  id: string;
  title: string;
  body: string;
};

export const ACCESS_TO_WORK_CHECKLIST: string[] = [
  'Identify the specific work-related barrier you are experiencing.',
  'Gather concrete examples of the difficulty at work.',
  'Consider possible adjustments, tools, coaching, travel support, or support-worker needs.',
  'Check the official UK government Access to Work guidance before applying.',
  'Prepare your employer and job details where required.',
  'Keep copies of correspondence and decisions.',
  'Review any decision carefully and ask for clarification if anything is unclear.',
];

export const REASONABLE_ADJUSTMENT_EXAMPLES: string[] = [
  'Written instructions for tasks and meetings.',
  'Flexible communication methods (written, async, captions).',
  'A quieter workspace or noise-reduction options.',
  'Extra processing time on tasks and questions.',
  'Assistive software or tools.',
  'Clear routines and predictable deadlines.',
  'Meeting notes or recordings where appropriate.',
];

export const US_ADA_OVERVIEW: string[] = [
  'The Americans with Disabilities Act may require reasonable accommodations in employment.',
  'Eligibility, process, and protections depend on employer size, role, and jurisdiction.',
  'Always check the official ADA.gov guidance or a qualified professional before relying on this information.',
];

export const TEMPLATES: RightsTemplate[] = [
  {
    id: 'workplace-adjustment',
    title: 'Request for workplace adjustment',
    body:
      'Hello [Manager],\n\nI would like to request a workplace adjustment to help me work more effectively. Specifically, I find [describe the barrier] difficult, and an adjustment such as [describe the adjustment] would help.\n\nI am happy to discuss this further and explore options that work for both of us. Could we arrange a short meeting?\n\nThank you,\n[Your name]',
  },
  {
    id: 'agenda-in-advance',
    title: 'Request for meeting agenda in advance',
    body:
      'Hello [Organiser],\n\nCould you share the agenda and any pre-reading for [meeting] at least [time] in advance? Having time to prepare helps me contribute more effectively.\n\nThank you,\n[Your name]',
  },
  {
    id: 'written-instructions',
    title: 'Request for written instructions',
    body:
      'Hello [Manager],\n\nFor tasks like [task type], could we follow up verbal instructions with a short written summary or checklist? It helps me confirm details accurately and reduces back-and-forth later.\n\nThank you,\n[Your name]',
  },
  {
    id: 'quiet-workspace',
    title: 'Request for a quieter workspace or sensory adjustment',
    body:
      'Hello [Manager],\n\nI work best in lower-stimulation environments. Could we explore options such as [a quieter seat, noise-reducing headphones, a focus block, or a specific room]? I am happy to suggest practical options.\n\nThank you,\n[Your name]',
  },
  {
    id: 'school-support-meeting',
    title: 'Request for a school support meeting',
    body:
      'Hello [Teacher/SENCO/Counselor],\n\nWe would like to arrange a short meeting to discuss support for [child name]. We have noticed [describe observation] and would like to talk through what is working at school and how we can support consistently at home.\n\nCould we arrange a time in the next two weeks?\n\nThank you,\n[Your name]',
  },
  {
    id: 'employer-conversation-checklist',
    title: 'Employer conversation checklist',
    body:
      '- One clear barrier I want to discuss.\n- One or two concrete examples.\n- Two or three adjustments I would like to explore.\n- Questions I want answered.\n- Notes from the meeting and the agreed next step.\n- A date to review whether the adjustment is working.',
  },
];
