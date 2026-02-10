export interface EditorialRole {
  id: string;
  title: string;
  responsibilities: string[];
}

export const EDITORIAL_ROLES: EditorialRole[] = [
  {
    id: 'author',
    title: 'Author',
    responsibilities: ['Drafts content aligned to standards.', 'Uses plain language and safe framing.'],
  },
  {
    id: 'reviewer',
    title: 'Reviewer',
    responsibilities: ['Checks clarity, risk language, and disclaimers.', 'Confirms citations are present.'],
  },
  {
    id: 'evidence-reviewer',
    title: 'Evidence reviewer',
    responsibilities: ['Checks source quality tiers.', 'Flags outdated or weak evidence.'],
  },
  {
    id: 'accessibility-reviewer',
    title: 'Accessibility reviewer',
    responsibilities: ['Checks readability and accessibility notes.', 'Ensures inclusive language.'],
  },
  {
    id: 'editor',
    title: 'Editor',
    responsibilities: ['Final approval before publish.', 'Ensures tone consistency.'],
  },
];

export const EDITORIAL_ROLE_BY_ID = new Map(EDITORIAL_ROLES.map(role => [role.id, role]));

export const getEditorialRoleById = (id: string) => EDITORIAL_ROLE_BY_ID.get(id);
