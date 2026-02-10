// This file will be populated with processed research data
// In production, you would import the JSON file and process it
// For now, we'll create a function to load and process the data

import { ResearchData } from '../types';

export const getResearchData = (): ResearchData | null => {
  // This would normally load from the JSON file
  // For the actual implementation, you'll need to copy the JSON content here
  // or use dynamic imports in Next.js
  return null;
};

// Helper function to extract text content with language support
export const extractContent = (data: unknown, language: 'en-GB' | 'en-US'): string => {
  if (!data) return '';
  
  if (typeof data === 'string') return data;

  if (typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const ukContent = record.uk_content;
    const usContent = record.us_content;
    const description = record.description;

    if (language === 'en-GB' && typeof ukContent === 'string') return ukContent;
    if (language === 'en-US' && typeof usContent === 'string') return usContent;
    if (typeof description === 'string') return description;
  }
  
  return '';
};
