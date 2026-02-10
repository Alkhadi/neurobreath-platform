export type EditorialFocusArea =
  | 'ADHD'
  | 'autism'
  | 'dyslexia'
  | 'breathing tools'
  | 'education'
  | 'wellbeing'
  | 'accessibility'
  | 'trust';

export interface EditorialPerson {
  id: string;
  displayName: string;
  roleTitle: string;
  bio: string;
  credentials?: string[];
  focusAreas: EditorialFocusArea[];
  localeNotes?: string;
  profileImage?: string;
  publicProfileUrl?: string;
}

export const EDITORIAL_PEOPLE: EditorialPerson[] = [
  {
    id: 'nb-editorial-team',
    displayName: 'NeuroBreath Editorial Team',
    roleTitle: 'Editorial team',
    bio: 'Writes and maintains educational wellbeing content with a focus on clarity, safety language, and practical routines.',
    focusAreas: ['ADHD', 'autism', 'dyslexia', 'breathing tools', 'education', 'wellbeing'],
    publicProfileUrl: '/editorial/nb-editorial-team',
  },
  {
    id: 'nb-evidence-review',
    displayName: 'Evidence Review Desk',
    roleTitle: 'Evidence reviewer',
    bio: 'Checks that sources meet quality tiers and that summaries stay educational and non-clinical.',
    focusAreas: ['trust', 'education', 'wellbeing'],
    publicProfileUrl: '/editorial/nb-evidence-review',
  },
  {
    id: 'nb-accessibility-review',
    displayName: 'Accessibility Review Desk',
    roleTitle: 'Accessibility reviewer',
    bio: 'Reviews readability, inclusive language, and accessibility notes across guidance and templates.',
    focusAreas: ['accessibility', 'education', 'trust'],
    publicProfileUrl: '/editorial/nb-accessibility-review',
  },
];

export const EDITORIAL_PEOPLE_BY_ID = new Map(EDITORIAL_PEOPLE.map(person => [person.id, person]));

export const getEditorialPersonById = (id: string) => EDITORIAL_PEOPLE_BY_ID.get(id);
