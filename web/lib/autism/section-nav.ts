// Section navigation utilities for smooth scrolling
// Extracted from inline logic to keep components clean

export type SectionId = 
  | 'how-to-use'
  | 'skills'
  | 'calm'
  | 'progress'
  | 'crisis'
  | 'myths'
  | 'references';

/**
 * Smooth scroll to a section by ID
 * @param sectionId - The section to scroll to
 */
export function scrollToSection(sectionId: SectionId): void {
  const element = document.querySelector(`[data-section="${sectionId}"]`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Smooth scroll to a section by selector
 * @param selector - The CSS selector
 */
export function scrollToElement(selector: string): void {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Get navigation sections for the hero quick-jump cards
 */
export function getNavigationSections() {
  return [
    {
      id: 'how-to-use' as SectionId,
      title: 'How to use this page',
      description: 'Quick tour and getting started guide'
    },
    {
      id: 'skills' as SectionId,
      title: 'Skills Library',
      description: 'Evidence-based strategies with how-to steps'
    },
    {
      id: 'calm' as SectionId,
      title: 'Calm Toolkit',
      description: 'Breathing exercises and calming techniques'
    },
    {
      id: 'progress' as SectionId,
      title: 'Progress Dashboard',
      description: 'Track your practice and earn badges'
    },
    {
      id: 'crisis' as SectionId,
      title: 'Crisis Support',
      description: 'Emergency resources and helplines'
    },
    {
      id: 'references' as SectionId,
      title: 'Evidence & References',
      description: 'NICE, NHS, CDC, and research links'
    }
  ];
}

