export type RegionKey = 'UK' | 'US';

export type LocalisedString = {
  base: string;
  UK?: string;
  US?: string;
  requireOverride?: boolean;
};

export interface ContentCTA {
  label: LocalisedString;
  href: string;
}

export interface RelatedContentItem {
  href: string;
  label: LocalisedString;
  description?: LocalisedString;
  typeBadge?: string;
}

export interface ContentBlockBase {
  id: string;
  type: 'heading' | 'paragraph' | 'bullets' | 'callout' | 'cta' | 'steps' | 'divider';
}

export interface HeadingBlock extends ContentBlockBase {
  type: 'heading';
  level: 'h2' | 'h3';
  text: LocalisedString;
}

export interface ParagraphBlock extends ContentBlockBase {
  type: 'paragraph';
  text: LocalisedString;
}

export interface BulletsBlock extends ContentBlockBase {
  type: 'bullets';
  items: LocalisedString[];
}

export interface CalloutBlock extends ContentBlockBase {
  type: 'callout';
  text: LocalisedString;
}

export interface StepsBlock extends ContentBlockBase {
  type: 'steps';
  items: LocalisedString[];
}

export interface CtaBlock extends ContentBlockBase {
  type: 'cta';
  cta: ContentCTA;
}

export interface DividerBlock extends ContentBlockBase {
  type: 'divider';
}

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | BulletsBlock
  | CalloutBlock
  | StepsBlock
  | CtaBlock
  | DividerBlock;

export interface FaqItem {
  question: LocalisedString;
  answer: LocalisedString;
}

export interface ContentPage {
  id: string;
  slugs: { UK: string; US: string };
  seo: {
    title: LocalisedString;
    description: LocalisedString;
  };
  h1: LocalisedString;
  blocks: ContentBlock[];
  faqs?: { base: FaqItem[]; UK?: FaqItem[]; US?: FaqItem[] };
  related?: RelatedContentItem[];
  relatedTitle?: LocalisedString;
  citationsByRegion: { UK: string[]; US: string[]; GLOBAL?: string[] };
  reviewedAt: string;
  reviewIntervalDays: number;
  primaryPillar?: string;
  tags?: string[];
  summary?: string;
  pageType?: 'pillar' | 'cluster' | 'tool' | 'trust' | 'other';
}
