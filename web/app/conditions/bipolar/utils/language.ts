// Language detection and translation utilities
import { Language } from '../types';

// Detect user's preferred language based on browser settings
export const detectLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en-GB';
  
  const browserLang = navigator.language || (navigator as any).userLanguage;
  
  // Check for US English variants
  if (browserLang.startsWith('en-US') || 
      browserLang.startsWith('en-CA') || 
      browserLang === 'en') {
    return 'en-US';
  }
  
  // Default to UK English for UK, AU, NZ, IE, and other English variants
  return 'en-GB';
};

// Get stored language preference or auto-detect
export const getLanguagePreference = (): Language => {
  if (typeof window === 'undefined') return 'en-GB';
  
  try {
    const stored = localStorage.getItem('bipolar_language_preference');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.language;
    }
  } catch (e) {
    console.error('Error reading language preference:', e);
  }
  
  return detectLanguage();
};

// Save language preference
export const saveLanguagePreference = (language: Language, autoDetected: boolean = false) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('bipolar_language_preference', JSON.stringify({
      language,
      autoDetected,
      savedAt: new Date().toISOString()
    }));
  } catch (e) {
    console.error('Error saving language preference:', e);
  }
};

// Spelling differences between UK and US English
export const translations: Record<Language, Record<string, string>> = {
  'en-GB': {
    // UK English spellings
    'stabilizer': 'stabiliser',
    'organization': 'organisation',
    'organizations': 'organisations',
    'recognize': 'recognise',
    'recognized': 'recognised',
    'recognizing': 'recognising',
    'behavior': 'behaviour',
    'behavioral': 'behavioural',
    'behaviors': 'behaviours',
    'color': 'colour',
    'center': 'centre',
    'centers': 'centres',
    'analyze': 'analyse',
    'analyzed': 'analysed',
    'analyzing': 'analysing',
    'optimize': 'optimise',
    'optimized': 'optimised',
    'specialized': 'specialised',
    'hospitalization': 'hospitalisation',
    'counseling': 'counselling',
    'counselor': 'counsellor',
    'favorite': 'favourite',
    'gray': 'grey',
    'labor': 'labour',
    'maneuvered': 'manoeuvred',
    'program': 'programme',
    'programs': 'programmes',
  },
  'en-US': {
    // US English spellings (identity mapping, for consistency)
    'stabilizer': 'stabilizer',
    'organization': 'organization',
    'organizations': 'organizations',
    'recognize': 'recognize',
    'recognized': 'recognized',
    'recognizing': 'recognizing',
    'behavior': 'behavior',
    'behavioral': 'behavioral',
    'behaviors': 'behaviors',
    'color': 'color',
    'center': 'center',
    'centers': 'centers',
    'analyze': 'analyze',
    'analyzed': 'analyzed',
    'analyzing': 'analyzing',
    'optimize': 'optimize',
    'optimized': 'optimized',
    'specialized': 'specialized',
    'hospitalization': 'hospitalization',
    'counseling': 'counseling',
    'counselor': 'counselor',
    'favorite': 'favorite',
    'gray': 'gray',
    'labor': 'labor',
    'maneuvered': 'maneuvered',
    'program': 'program',
    'programs': 'programs',
  }
};

// Translate a word based on the selected language
export const translate = (word: string, language: Language): string => {
  return translations[language][word.toLowerCase()] || word;
};

// Apply spelling to entire text
export const applySpelling = (text: string, language: Language): string => {
  let result = text;
  const dict = translations[language];
  
  // Apply translations
  Object.keys(dict).forEach(key => {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    result = result.replace(regex, (match) => {
      // Preserve capitalization
      if (match[0] === match[0].toUpperCase()) {
        return dict[key].charAt(0).toUpperCase() + dict[key].slice(1);
      }
      return dict[key];
    });
  });
  
  return result;
};
