export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://neurobreath.co.uk';
export const LOCALES = ['uk', 'us'] as const;
export type LocaleKey = (typeof LOCALES)[number];

export const LOCALE_CONFIG: Record<LocaleKey, { language: string; locale: string }> = {
  uk: { language: 'en-GB', locale: 'en_GB' },
  us: { language: 'en-US', locale: 'en_US' },
};

export const DEFAULT_LOCALE: LocaleKey = 'uk';
