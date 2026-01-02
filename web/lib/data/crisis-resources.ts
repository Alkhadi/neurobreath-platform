import { CrisisResource } from '../types';

export const crisisResources: CrisisResource[] = [
  {
    country: 'UK',
    name: 'NHS 111 - Mental Health Crisis',
    phone: '111 (option 2)',
    description: 'NHS urgent mental health helpline',
    url: 'https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/',
    hours: '24/7'
  },
  {
    country: 'UK',
    name: 'Samaritans',
    phone: '116 123',
    description: 'Free 24/7 emotional support',
    url: 'https://www.samaritans.org/',
    hours: '24/7'
  },
  {
    country: 'UK',
    name: 'Emergency Services',
    phone: '999',
    description: 'If you or someone else is in immediate danger',
    hours: '24/7'
  },
  {
    country: 'US',
    name: '988 Suicide & Crisis Lifeline',
    phone: '988',
    description: 'National crisis support line',
    url: 'https://988lifeline.org/',
    hours: '24/7'
  },
  {
    country: 'US',
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: 'Free 24/7 crisis support via text',
    url: 'https://www.crisistextline.org/',
    hours: '24/7'
  },
  {
    country: 'US',
    name: 'Emergency Services',
    phone: '911',
    description: 'If you or someone else is in immediate danger',
    hours: '24/7'
  },
  {
    country: 'EU',
    name: 'EU Emergency Number',
    phone: '112',
    description: 'Emergency services across EU countries',
    hours: '24/7'
  },
  {
    country: 'EU',
    name: 'Befrienders Worldwide',
    phone: 'Varies by country',
    description: 'International crisis support directory',
    url: 'https://www.befrienders.org/',
    hours: 'Varies'
  }
];
