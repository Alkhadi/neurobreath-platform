export type VerificationStatus = 'unverified' | 'pending' | 'verified';

export type PractitionerListing = {
  id: string;
  name: string;
  organisation?: string;
  role: string;
  country: string;
  region?: string;
  supportAreas: string[];
  deliveryModes: string[];
  fundingOptions: string[];
  ageGroups: string[];
  website?: string;
  contactEmail?: string;
  verificationStatus: VerificationStatus;
  lastVerifiedAt?: string;
  notes?: string;
  emergencyNotice: string;
};

// No real practitioners are listed. Verified entries will be added after
// independent credential checks. Do not present unverified entries as trusted.
export const PRACTITIONER_LISTINGS: PractitionerListing[] = [];

export const SUPPORT_TYPES = [
  'clinician',
  'coach',
  'workplace consultant',
  'tutor',
  'therapist',
  'other',
] as const;

export const SUPPORT_AREAS = [
  'ADHD',
  'Autism',
  'Dyslexia',
  'Dyspraxia',
  'Dyscalculia',
  'Sensory processing',
  'Executive function',
  'Anxiety and stress',
  'Sleep',
] as const;

export const DELIVERY_MODES = ['Online', 'In-person', 'Hybrid'] as const;

export const FUNDING_OPTIONS = [
  'Access to Work',
  'Private pay',
  'Insurance',
  'School-funded',
  'Employer-funded',
  'Unknown',
] as const;

export const AGE_GROUPS = ['Children', 'Teens', 'Adults', 'Families'] as const;

export const COUNTRIES = ['United Kingdom', 'United States', 'Other'] as const;
