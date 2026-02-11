/**
 * NB-Card CSV Importer
 * 
 * Batch import contacts from CSV files with field mapping support.
 * Handles common CSV formats (Excel, Google Sheets, vCard exports).
 */

import type { Contact } from "@/lib/utils";

/**
 * CSV field mapping configuration
 */
export type CSVFieldMap = {
  name?: string;           // 'Name', 'Full Name', 'Contact Name'
  email?: string;          // 'Email', 'Email Address', 'E-mail'
  phone?: string;          // 'Phone', 'Phone Number', 'Mobile'
  company?: string;        // 'Company', 'Organization', 'Org'
  jobTitle?: string;       // 'Job Title', 'Title', 'Position'
  notes?: string;          // 'Notes', 'Comments', 'Description'
  instagram?: string;      // 'Instagram', 'IG'
  facebook?: string;       // 'Facebook', 'FB'
  linkedin?: string;       // 'LinkedIn', 'LI'
  twitter?: string;        // 'Twitter', 'X'
  website?: string;        // 'Website', 'URL', 'Web'
};

/**
 * Auto-detect CSV field mapping from headers
 */
export function autoDetectFieldMapping(headers: string[]): CSVFieldMap {
  const normalized = headers.map(h => h.toLowerCase().trim());
  const mapping: CSVFieldMap = {};
  
  for (let i = 0; i < normalized.length; i++) {
    const header = normalized[i];
    const original = headers[i];
    
    // Name variations
    if (/^(name|full[ _]?name|contact[ _]?name)$/i.test(header)) {
      mapping.name = original;
    }
    // Email variations
    else if (/^(email|e-?mail|email[ _]?address)$/i.test(header)) {
      mapping.email = original;
    }
    // Phone variations
    else if (/^(phone|mobile|tel|telephone|phone[ _]?number)$/i.test(header)) {
      mapping.phone = original;
    }
    // Company variations
    else if (/^(company|organization|org|business)$/i.test(header)) {
      mapping.company = original;
    }
    // Job title variations
    else if (/^(job[ _]?title|title|position|role)$/i.test(header)) {
      mapping.jobTitle = original;
    }
    // Notes variations
    else if (/^(notes|comments|description|memo)$/i.test(header)) {
      mapping.notes = original;
    }
    // Social media
    else if (/^(instagram|ig)$/i.test(header)) {
      mapping.instagram = original;
    }
    else if (/^(facebook|fb)$/i.test(header)) {
      mapping.facebook = original;
    }
    else if (/^(linkedin|li)$/i.test(header)) {
      mapping.linkedin = original;
    }
    else if (/^(twitter|x)$/i.test(header)) {
      mapping.twitter = original;
    }
    else if (/^(website|url|web|homepage)$/i.test(header)) {
      mapping.website = original;
    }
  }
  
  return mapping;
}

/**
 * Parse CSV content into rows
 * Handles quoted fields, escaped commas, and newlines
 */
export function parseCSV(content: string): string[][] {
  const rows: string[][] = [];
  const lines = content.split('\n');
  
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  
  for (const line of lines) {
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          currentField += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        currentRow.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    
    // End of line
    if (!inQuotes || line === lines[lines.length - 1]) {
      currentRow.push(currentField.trim());
      
      // Only add non-empty rows
      if (currentRow.some(field => field.length > 0)) {
        rows.push(currentRow);
      }
      
      currentRow = [];
      currentField = '';
      inQuotes = false;
    } else {
      // Multi-line field (quoted)
      currentField += '\n';
    }
  }
  
  return rows;
}

/**
 * Import contacts from CSV content
 */
export function importContactsFromCSV(
  content: string,
  fieldMap?: CSVFieldMap
): { contacts: Contact[]; errors: string[] } {
  const errors: string[] = [];
  const contacts: Contact[] = [];
  
  try {
    const rows = parseCSV(content);
    
    if (rows.length === 0) {
      errors.push('CSV file is empty');
      return { contacts, errors };
    }
    
    // First row is headers
    const headers = rows[0];
    const mapping = fieldMap || autoDetectFieldMapping(headers);
    
    // Check if we detected any mappings
    if (!mapping.name && !mapping.email && !mapping.phone) {
      errors.push('Could not detect name, email, or phone columns. Please map fields manually.');
      return { contacts, errors };
    }
    
    // Process data rows
    for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      
      try {
        const contact = mapRowToContact(row, headers, mapping);
        
        // Validate contact has at least name or email or phone
        if (!contact.name && !contact.email && !contact.phone) {
          errors.push(`Row ${rowIndex + 1}: Missing required fields (name, email, or phone)`);
          continue;
        }
        
        contacts.push(contact);
      } catch (error) {
        errors.push(`Row ${rowIndex + 1}: ${error instanceof Error ? error.message : 'Import failed'}`);
      }
    }
    
    return { contacts, errors };
    
  } catch (error) {
    errors.push(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { contacts, errors };
  }
}

/**
 * Map a CSV row to a Contact object
 */
function mapRowToContact(row: string[], headers: string[], mapping: CSVFieldMap): Contact {
  const getField = (mappedHeader?: string): string => {
    if (!mappedHeader) return '';
    const index = headers.indexOf(mappedHeader);
    return index >= 0 && index < row.length ? row[index].trim() : '';
  };
  
  // Generate unique ID
  const id = `csv-import-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const createdAt = new Date().toISOString();
  
  return {
    id,
    createdAt,
    name: getField(mapping.name) || 'Unknown Contact',
    email: getField(mapping.email) || '',
    phone: getField(mapping.phone) || '',
    company: getField(mapping.company) || '',
    jobTitle: getField(mapping.jobTitle) || '',
    notes: getField(mapping.notes) || '',
    category: 'Business', // Default to Business
    socialMedia: {
      instagram: getField(mapping.instagram) || undefined,
      facebook: getField(mapping.facebook) || undefined,
      linkedin: getField(mapping.linkedin) || undefined,
      twitter: getField(mapping.twitter) || undefined,
      website: getField(mapping.website) || undefined,
    },
  };
}

/**
 * Generate CSV template for user download
 */
export function generateCSVTemplate(): string {
  const headers = [
    'Name',
    'Email',
    'Phone',
    'Company',
    'Job Title',
    'Notes',
    'Instagram',
    'Facebook',
    'LinkedIn',
    'Twitter',
    'Website',
  ];
  
  const exampleRow = [
    'John Doe',
    'john@example.com',
    '+44 7123 456789',
    'Example Corp',
    'Product Manager',
    'Met at conference',
    'https://instagram.com/johndoe',
    '',
    'https://linkedin.com/in/johndoe',
    '',
    'https://johndoe.com',
  ];
  
  return `${headers.join(',')}\n${exampleRow.map(field => 
    field.includes(',') || field.includes('"') || field.includes('\n')
      ? `"${field.replace(/"/g, '""')}"`
      : field
  ).join(',')}`;
}

/**
 * Validate CSV file before import
 */
export function validateCSVFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (file.type && !file.type.includes('csv') && !file.type.includes('text')) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a CSV file.',
    };
  }
  
  // Check file extension
  if (!file.name.toLowerCase().endsWith('.csv')) {
    return {
      valid: false,
      error: 'File must have .csv extension.',
    };
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 10MB.',
    };
  }
  
  // Check filename for suspicious patterns
  const filename = file.name.toLowerCase();
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return {
      valid: false,
      error: 'Invalid filename.',
    };
  }
  
  return { valid: true };
}
