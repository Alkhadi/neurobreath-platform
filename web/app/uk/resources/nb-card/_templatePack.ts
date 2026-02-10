/**
 * Built-in Professional Templates Pack for NB-Card
 * Zero admin dependency — always available fallback
 */

export type TemplateCategory = "ADDRESS" | "BANK" | "BUSINESS";

export interface NbCardTemplate {
  id: string;
  category: TemplateCategory;
  name: string;
  title: string;
  alt: string;
  backgroundUrl: string;
  avatarUrl: string;
  sortOrder: number;
}

export const BUILTIN_TEMPLATES: NbCardTemplate[] = [
  // ADDRESS (6)
  {
    id: "address-01",
    category: "ADDRESS",
    name: "Address Slate",
    title: "Address Slate — Clean address details frame",
    alt: "Professional address template with soft slate gradient and location motif",
    backgroundUrl: "/nb-card/templates/address/address-01-bg.svg",
    avatarUrl: "/nb-card/templates/address/address-01-avatar.svg",
    sortOrder: 1,
  },
  {
    id: "address-02",
    category: "ADDRESS",
    name: "City Compass",
    title: "City Compass — Modern address presentation template",
    alt: "Professional address template with compass lines and city grid accents",
    backgroundUrl: "/nb-card/templates/address/address-02-bg.svg",
    avatarUrl: "/nb-card/templates/address/address-02-avatar.svg",
    sortOrder: 2,
  },
  {
    id: "address-03",
    category: "ADDRESS",
    name: "Neighbourhood Pro",
    title: "Neighbourhood Pro — Trust-first address frame",
    alt: "Professional address template with minimal map-pin pattern and high readability",
    backgroundUrl: "/nb-card/templates/address/address-03-bg.svg",
    avatarUrl: "/nb-card/templates/address/address-03-avatar.svg",
    sortOrder: 3,
  },
  {
    id: "address-04",
    category: "ADDRESS",
    name: "Postcode Prime",
    title: "Postcode Prime — Crisp address details template",
    alt: "Professional address template with subtle postcode blocks and calm gradient",
    backgroundUrl: "/nb-card/templates/address/address-04-bg.svg",
    avatarUrl: "/nb-card/templates/address/address-04-avatar.svg",
    sortOrder: 4,
  },
  {
    id: "address-05",
    category: "ADDRESS",
    name: "Landmark Linework",
    title: "Landmark Linework — Elegant address template",
    alt: "Professional address template with fine linework and premium layout spacing",
    backgroundUrl: "/nb-card/templates/address/address-05-bg.svg",
    avatarUrl: "/nb-card/templates/address/address-05-avatar.svg",
    sortOrder: 5,
  },
  {
    id: "address-06",
    category: "ADDRESS",
    name: "Route Card",
    title: "Route Card — Practical address details design",
    alt: "Professional address template with route lines and clean contact focus",
    backgroundUrl: "/nb-card/templates/address/address-06-bg.svg",
    avatarUrl: "/nb-card/templates/address/address-06-avatar.svg",
    sortOrder: 6,
  },

  // BANK (6)
  {
    id: "bank-01",
    category: "BANK",
    name: "Secure Navy",
    title: "Secure Navy — Bank details frame with premium look",
    alt: "Professional bank template with navy gradient, security pattern, and clarity",
    backgroundUrl: "/nb-card/templates/bank/bank-01-bg.svg",
    avatarUrl: "/nb-card/templates/bank/bank-01-avatar.svg",
    sortOrder: 1,
  },
  {
    id: "bank-02",
    category: "BANK",
    name: "Invoice Minimal",
    title: "Invoice Minimal — Clean payment details template",
    alt: "Professional bank template with minimal invoice layout and strong contrast",
    backgroundUrl: "/nb-card/templates/bank/bank-02-bg.svg",
    avatarUrl: "/nb-card/templates/bank/bank-02-avatar.svg",
    sortOrder: 2,
  },
  {
    id: "bank-03",
    category: "BANK",
    name: "Emerald Pay",
    title: "Emerald Pay — Payment-ready bank template",
    alt: "Professional bank template with emerald gradient and discreet finance iconography",
    backgroundUrl: "/nb-card/templates/bank/bank-03-bg.svg",
    avatarUrl: "/nb-card/templates/bank/bank-03-avatar.svg",
    sortOrder: 3,
  },
  {
    id: "bank-04",
    category: "BANK",
    name: "Ledger Lines",
    title: "Ledger Lines — Structured bank details design",
    alt: "Professional bank template with ledger lines and audit-style neatness",
    backgroundUrl: "/nb-card/templates/bank/bank-04-bg.svg",
    avatarUrl: "/nb-card/templates/bank/bank-04-avatar.svg",
    sortOrder: 4,
  },
  {
    id: "bank-05",
    category: "BANK",
    name: "Trust Black",
    title: "Trust Black — Executive bank details frame",
    alt: "Professional bank template with black premium style and subtle shield pattern",
    backgroundUrl: "/nb-card/templates/bank/bank-05-bg.svg",
    avatarUrl: "/nb-card/templates/bank/bank-05-avatar.svg",
    sortOrder: 5,
  },
  {
    id: "bank-06",
    category: "BANK",
    name: "Clean Transfer",
    title: "Clean Transfer — Simple bank details template",
    alt: "Professional bank template with simple transfer motif and high readability",
    backgroundUrl: "/nb-card/templates/bank/bank-06-bg.svg",
    avatarUrl: "/nb-card/templates/bank/bank-06-avatar.svg",
    sortOrder: 6,
  },

  // BUSINESS (6)
  {
    id: "business-01",
    category: "BUSINESS",
    name: "Executive Charcoal",
    title: "Executive Charcoal — Business profile template",
    alt: "Professional business template with charcoal style and executive presentation",
    backgroundUrl: "/nb-card/templates/business/business-01-bg.svg",
    avatarUrl: "/nb-card/templates/business/business-01-avatar.svg",
    sortOrder: 1,
  },
  {
    id: "business-02",
    category: "BUSINESS",
    name: "Startup Gradient",
    title: "Startup Gradient — Modern business profile design",
    alt: "Professional business template with modern gradient and dynamic shape accents",
    backgroundUrl: "/nb-card/templates/business/business-02-bg.svg",
    avatarUrl: "/nb-card/templates/business/business-02-avatar.svg",
    sortOrder: 2,
  },
  {
    id: "business-03",
    category: "BUSINESS",
    name: "Consultant White",
    title: "Consultant White — Clean business profile template",
    alt: "Professional business template with white space and premium clarity",
    backgroundUrl: "/nb-card/templates/business/business-03-bg.svg",
    avatarUrl: "/nb-card/templates/business/business-03-avatar.svg",
    sortOrder: 3,
  },
  {
    id: "business-04",
    category: "BUSINESS",
    name: "Studio Indigo",
    title: "Studio Indigo — Creative business profile frame",
    alt: "Professional business template with indigo theme and tasteful creative lines",
    backgroundUrl: "/nb-card/templates/business/business-04-bg.svg",
    avatarUrl: "/nb-card/templates/business/business-04-avatar.svg",
    sortOrder: 4,
  },
  {
    id: "business-05",
    category: "BUSINESS",
    name: "Corporate Blue",
    title: "Corporate Blue — Classic business identity template",
    alt: "Professional business template with corporate blue and confident structure",
    backgroundUrl: "/nb-card/templates/business/business-05-bg.svg",
    avatarUrl: "/nb-card/templates/business/business-05-avatar.svg",
    sortOrder: 5,
  },
  {
    id: "business-06",
    category: "BUSINESS",
    name: "Signature Gold",
    title: "Signature Gold — Premium business profile template",
    alt: "Professional business template with subtle gold accents and high-end layout",
    backgroundUrl: "/nb-card/templates/business/business-06-bg.svg",
    avatarUrl: "/nb-card/templates/business/business-06-avatar.svg",
    sortOrder: 6,
  },
];

/**
 * Get templates for a specific category
 */
export function getTemplatesByCategory(category: TemplateCategory): NbCardTemplate[] {
  return BUILTIN_TEMPLATES.filter((t) => t.category === category).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}

/**
 * Get a template by ID
 */
export function getTemplateById(id: string): NbCardTemplate | undefined {
  return BUILTIN_TEMPLATES.find((t) => t.id === id);
}

/**
 * Get default template for a category (always the first one)
 */
export function getDefaultTemplate(category: TemplateCategory): NbCardTemplate {
  const templates = getTemplatesByCategory(category);
  return templates[0];
}
