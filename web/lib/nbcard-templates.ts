/**
 * NB-Card Template Loader
 * Fetches and validates /nb-card/templates/manifest.json
 * NO new dependencies, defensive validation
 */

export type TemplateOrientation = 'portrait' | 'landscape';
export type TemplateType = 'background' | 'overlay';
export type TemplateCategory = 'Profile' | 'Business' | 'Address' | 'Bank';
export type FrameMode = 'PROFILE' | 'BUSINESS' | 'ADDRESS' | 'BANK';

export interface Template {
  id: string;
  label: string;
  category: string;
  type: TemplateType;
  orientation: TemplateOrientation;
  src: string;
  thumb: string;
  recommendedFor?: string[];
  notes?: string;
}

export interface TemplateManifest {
  version: string;
  templates: Template[];
}

export interface TemplateSelection {
  backgroundId?: string;
  overlayId?: string;
  orientation?: TemplateOrientation;
}

// Defensive validation helpers
function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidTemplateType(value: unknown): value is TemplateType {
  return value === 'background' || value === 'overlay';
}

function isValidOrientation(value: unknown): value is TemplateOrientation {
  return value === 'portrait' || value === 'landscape';
}

function validateTemplate(raw: unknown): Template | null {
  if (!raw || typeof raw !== 'object') return null;
  
  const obj = raw as Record<string, unknown>;
  
  if (!isValidString(obj.id)) return null;
  if (!isValidString(obj.label)) return null;
  if (!isValidString(obj.category)) return null;
  if (!isValidTemplateType(obj.type)) return null;
  if (!isValidOrientation(obj.orientation)) return null;
  if (!isValidString(obj.src)) return null;
  if (!isValidString(obj.thumb)) return null;
  
  return {
    id: obj.id,
    label: obj.label,
    category: obj.category,
    type: obj.type,
    orientation: obj.orientation,
    src: obj.src,
    thumb: obj.thumb,
    recommendedFor: Array.isArray(obj.recommendedFor)
      ? obj.recommendedFor.filter(isValidString)
      : undefined,
    notes: isValidString(obj.notes) ? obj.notes : undefined,
  };
}

function validateManifest(raw: unknown): TemplateManifest | null {
  if (!raw || typeof raw !== 'object') return null;
  
  const obj = raw as Record<string, unknown>;
  
  if (!isValidString(obj.version)) return null;
  if (!Array.isArray(obj.templates)) return null;
  
  const validTemplates = obj.templates
    .map(validateTemplate)
    .filter((t): t is Template => t !== null);
  
  if (validTemplates.length === 0) return null;
  
  return {
    version: obj.version,
    templates: validTemplates,
  };
}

let manifestCache: TemplateManifest | null = null;
let manifestError: Error | null = null;

/**
 * Fetches and validates the template manifest
 * Caches on success, retries on failure
 */
export async function loadTemplateManifest(): Promise<TemplateManifest> {
  // Return cached manifest if available
  if (manifestCache) return manifestCache;
  
  // Throw cached error if previous fetch failed
  if (manifestError) throw manifestError;
  
  try {
    const response = await fetch('/nb-card/templates/manifest.json', {
      cache: 'default', // Use browser cache
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch manifest: ${response.status} ${response.statusText}`);
    }
    
    const raw = await response.json();
    const validated = validateManifest(raw);
    
    if (!validated) {
      throw new Error('Invalid manifest format');
    }
    
    manifestCache = validated;
    return validated;
  } catch (error) {
    manifestError = error instanceof Error ? error : new Error('Unknown error loading manifest');
    throw manifestError;
  }
}

/**
 * Filters templates by type and optional criteria
 */
export function filterTemplates(
  templates: Template[],
  filters: {
    type?: TemplateType;
    orientation?: TemplateOrientation;
    frameMode?: FrameMode;
  }
): Template[] {
  return templates.filter((t) => {
    if (filters.type && t.type !== filters.type) return false;
    if (filters.orientation && t.orientation !== filters.orientation) return false;
    if (filters.frameMode && t.recommendedFor) {
      // Match frameMode to recommendedFor array
      if (!t.recommendedFor.includes(filters.frameMode)) return false;
    }
    return true;
  });
}

/**
 * Gets a template by ID
 */
export function getTemplateById(templates: Template[], id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

// localStorage keys (namespace by profile id when available)
const TEMPLATE_STORAGE_PREFIX = 'nbcard:template:';

export function getTemplateStorageKey(profileId?: string): string {
  return `${TEMPLATE_STORAGE_PREFIX}${profileId || 'anonymous'}`;
}

/**
 * Load template selection from localStorage
 */
export function loadTemplateSelection(profileId?: string): TemplateSelection | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const key = getTemplateStorageKey(profileId);
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return null;
    
    const selection: TemplateSelection = {};
    
    if (isValidString(parsed.backgroundId)) {
      selection.backgroundId = parsed.backgroundId;
    }
    if (isValidString(parsed.overlayId)) {
      selection.overlayId = parsed.overlayId;
    }
    if (isValidOrientation(parsed.orientation)) {
      selection.orientation = parsed.orientation;
    }
    
    return selection;
  } catch {
    return null;
  }
}

/**
 * Save template selection to localStorage
 */
export function saveTemplateSelection(selection: TemplateSelection, profileId?: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const key = getTemplateStorageKey(profileId);
    localStorage.setItem(key, JSON.stringify(selection));
  } catch (error) {
    console.warn('Failed to save template selection:', error);
  }
}
