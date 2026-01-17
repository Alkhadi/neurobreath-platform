import type { Region } from '@/lib/region/region';
import { getRegionKey } from '@/lib/region/region';

export type RegionKey = 'uk' | 'us';
export type AudienceKey = 'me' | 'parent-carer' | 'teacher' | 'workplace';

export interface LocaleCopy {
  locale: 'en-GB' | 'en-US';
  regionKey: RegionKey;
  valueProp: string;
  heroSubtitle: string;
  trustStrip: {
    disclaimer: string;
    trustCentreLabel: string;
    lastReviewedLabel: string;
  };
  audience: {
    label: string;
    options: Array<{ key: AudienceKey; label: string; blurb: string }>;
  };
  sections: {
    startHere: { title: string; subtitle: string };
    conditions: { title: string; subtitle: string; ctaLabel: string };
    tools: { title: string; subtitle: string; ctaLabel: string };
    guides: { title: string; subtitle: string; ctaLabel: string };
    proof: { title: string; bullets: string[] };
  };
  educationOnly: string;
  terminology: {
    sendTerm?: string;
    sencoTerm?: string;
    iepTerm?: string;
    plan504Term?: string;
  };
}

export function getLocaleCopy(region: Region): LocaleCopy {
  const regionKey = getRegionKey(region) as RegionKey;

  if (regionKey === 'us') {
    return {
      locale: 'en-US',
      regionKey,
      valueProp: 'Calm, focus, and routines—clear next steps for everyday support.',
      heroSubtitle: 'Educational tools and guides. No diagnosis. No medical claims.',
      trustStrip: {
        disclaimer: 'Educational only. Not medical advice.',
        trustCentreLabel: 'Trust Center',
        lastReviewedLabel: 'What “last reviewed” means',
      },
      audience: {
        label: 'Quick selector',
        options: [
          { key: 'me', label: 'For me', blurb: 'Personal routines, quick calm, and focus support.' },
          { key: 'parent-carer', label: 'Parent/Carer', blurb: 'Home routines, co-regulation, and practical steps.' },
          { key: 'teacher', label: 'Teacher', blurb: 'Classroom-friendly strategies and short resets.' },
          { key: 'workplace', label: 'Workplace', blurb: 'Work-ready routines for attention and stress.' },
        ],
      },
      sections: {
        startHere: {
          title: 'Start here in 60 seconds',
          subtitle: 'Pick one small action that helps right now.',
        },
        conditions: {
          title: 'Conditions we cover',
          subtitle: 'Find educational support across neurodivergent needs and support areas.',
          ctaLabel: 'Browse conditions',
        },
        tools: {
          title: 'Tools you can try today',
          subtitle: 'Quick exercises and structured supports grouped by need.',
          ctaLabel: 'Explore tools',
        },
        guides: {
          title: 'Guides (organized by topic)',
          subtitle: 'Evidence-informed, plain-language guides with safe, practical next steps.',
          ctaLabel: 'Explore guides',
        },
        proof: {
          title: 'Proof without claims',
          bullets: [
            'Evidence-informed language and clear safety boundaries.',
            'Last-reviewed signals on key educational pages.',
            'External sources shown as copy-only citations (no outbound tracking).',
            'Accessibility-first design: keyboard, focus, contrast, reduced motion.',
          ],
        },
      },
      educationOnly: 'Educational information only. Not medical advice.',
      terminology: {
        iepTerm: 'IEP',
        plan504Term: '504 plan',
      },
    };
  }

  return {
    locale: 'en-GB',
    regionKey,
    valueProp: 'Calm, focus, and routines—clear next steps for everyday support.',
    heroSubtitle: 'Educational tools and guides. No diagnosis. No medical claims.',
    trustStrip: {
      disclaimer: 'Educational only. Not medical advice.',
      trustCentreLabel: 'Trust Centre',
      lastReviewedLabel: 'What “last reviewed” means',
    },
    audience: {
      label: 'Quick selector',
      options: [
        { key: 'me', label: 'For me', blurb: 'Personal routines, quick calm, and focus support.' },
        { key: 'parent-carer', label: 'Parent/Carer', blurb: 'Home routines, co-regulation, and practical steps.' },
        { key: 'teacher', label: 'Teacher', blurb: 'Classroom-friendly strategies and short resets.' },
        { key: 'workplace', label: 'Workplace', blurb: 'Work-ready routines for attention and stress.' },
      ],
    },
    sections: {
      startHere: {
        title: 'Start here in 60 seconds',
        subtitle: 'Pick one small action that helps right now.',
      },
      conditions: {
        title: 'Conditions we cover',
        subtitle: 'Find educational support across neurodivergent needs and support areas.',
        ctaLabel: 'Browse conditions',
      },
      tools: {
        title: 'Tools you can try today',
        subtitle: 'Quick exercises and structured supports grouped by need.',
        ctaLabel: 'Explore tools',
      },
      guides: {
        title: 'Guides (organised by topic)',
        subtitle: 'Evidence-informed, plain-language guides with safe, practical next steps.',
        ctaLabel: 'Explore guides',
      },
      proof: {
        title: 'Proof without claims',
        bullets: [
          'Evidence-informed language and clear safety boundaries.',
          'Last-reviewed signals on key educational pages.',
          'External sources shown as copy-only citations (no outbound tracking).',
          'Accessibility-first design: keyboard, focus, contrast, reduced motion.',
        ],
      },
    },
    educationOnly: 'Educational information only. Not medical advice.',
    terminology: {
      sendTerm: 'SEND',
      sencoTerm: 'SENCO',
    },
  };
}
