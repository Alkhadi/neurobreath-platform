/**
 * NB-Card Template Loader
 * Fetches and validates /nb-card/templates/manifest.json
 * NO new dependencies, defensive validation
 */

export type TemplateOrientation = 'portrait' | 'landscape';
export type TemplateType = 'background' | 'overlay';
export type TemplateCategory = 'Profile' | 'Business' | 'Address' | 'Bank';
export type FrameMode = 'PROFILE' | 'BUSINESS' | 'ADDRESS' | 'BANK';
export type CardCategory = 'ADDRESS' | 'BANK' | 'BUSINESS' | 'PROFILE';
export type BusinessSide = 'front' | 'back';

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
  // Phase 3 additions:
  cardCategory?: CardCategory;
  exportWidth?: number;
  exportHeight?: number;
  side?: BusinessSide; // Only for BUSINESS templates
}

export interface TemplateManifest {
  version: string;
  templates: Template[];
}

export interface TemplateSelection {
  backgroundId?: string;
  overlayId?: string;
  orientation?: TemplateOrientation;
  /** Optional user-selected tint for template backgrounds (applied in UI + exports). */
  backgroundColor?: string;
}

export type TemplateTone = 'light' | 'dark';

export type TemplateThemeTokens = {
  /** Determines whether card content renders as white-on-dark or black-on-light. */
  tone: TemplateTone;
  /** Optional CSS filter to apply to the template background asset (UI + exports). */
  backgroundFilter?: string;
  /** Readability overlay alpha (0..1). Use 0 for no overlay. */
  readabilityOverlayAlpha?: number;
  /** If set, a white overlay is applied to intentionally lighten harsh/dark assets. */
  lightenOverlayAlpha?: number;
};

function isValidHexColor(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  if (!v) return false;
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v);
}

/**
 * Minimal theme token mapping used by both preview thumbnails and the live card.
 * Keep this intentionally small and defensive.
 */
export function getTemplateThemeTokens(templateId?: string | null): TemplateThemeTokens {
  const id = (templateId ?? '').toString();

  // Noticeably lighter treatment for these two templates.
  // tone='dark' ensures black text on the lightened surface for readability.
  if (id.startsWith('modern_geometric_v1_')) {
    return {
      tone: 'dark',
      backgroundFilter: 'brightness(1.35) contrast(0.88) saturate(0.85)',
      readabilityOverlayAlpha: 0.05,
      lightenOverlayAlpha: 0.35,
    };
  }

  if (id.startsWith('minimal_black_v1_')) {
    return {
      tone: 'dark',
      backgroundFilter: 'brightness(1.40) contrast(0.85) saturate(0.82)',
      readabilityOverlayAlpha: 0.05,
      lightenOverlayAlpha: 0.45,
    };
  }

  // Templates with prominent white/light content areas should render black text.
  if (id.startsWith('address_blue_v1_') || id.startsWith('flyer_promo_v1_')) {
    return {
      tone: 'dark',
      readabilityOverlayAlpha: 0,
      lightenOverlayAlpha: 0,
    };
  }

  // Default: keep existing white-on-dark look.
  return {
    tone: 'light',
    readabilityOverlayAlpha: 0.35,
    lightenOverlayAlpha: 0,
  };
}

/**
 * Determines whether a hex color is perceptually light.
 * Uses the W3C luminance formula for accessibility contrast decisions.
 */
export function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length !== 3 && c.length !== 6) return true; // default light
  const full = c.length === 3 ? c[0] + c[0] + c[1] + c[1] + c[2] + c[2] : c;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55;
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

function isValidCardCategory(value: unknown): value is CardCategory {
  return value === 'ADDRESS' || value === 'BANK' || value === 'BUSINESS' || value === 'PROFILE';
}

function isValidBusinessSide(value: unknown): value is BusinessSide {
  return value === 'front' || value === 'back';
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
    cardCategory: isValidCardCategory(obj.cardCategory) ? obj.cardCategory : undefined,
    exportWidth: typeof obj.exportWidth === 'number' && obj.exportWidth > 0 ? obj.exportWidth : undefined,
    exportHeight: typeof obj.exportHeight === 'number' && obj.exportHeight > 0 ? obj.exportHeight : undefined,
    side: isValidBusinessSide(obj.side) ? obj.side : undefined,
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

  // De-dupe by id (keep first occurrence to preserve author ordering).
  const seen = new Set<string>();
  const deduped: Template[] = [];
  for (const t of validTemplates) {
    if (seen.has(t.id)) continue;
    seen.add(t.id);
    deduped.push(t);
  }
  
  if (deduped.length === 0) return null;
  
  return {
    version: obj.version,
    templates: deduped,
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
      cache: 'no-store',
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

export function resetTemplateManifestCache(): void {
  manifestCache = null;
  manifestError = null;
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

    if (isValidHexColor(parsed.backgroundColor)) {
      selection.backgroundColor = parsed.backgroundColor;
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

/**
 * Get export dimensions from template metadata
 * Returns default dimensions if template not found or dimensions not specified
 */
export function getTemplateExportDimensions(template: Template | undefined | null): { width: number; height: number } {
  const defaultLandscape = { width: 1600, height: 900 };
  const defaultPortrait = { width: 900, height: 1200 };
  
  if (!template) {
    return defaultLandscape;
  }
  
  // Use template metadata if available
  if (template.exportWidth && template.exportHeight) {
    return { width: template.exportWidth, height: template.exportHeight };
  }
  
  // Fall back to orientation-based defaults
  return template.orientation === 'portrait' ? defaultPortrait : defaultLandscape;
}

/**
 * Calculate aspect ratio from template
 */
export function getTemplateAspectRatio(template: Template | undefined | null): string {
  const dims = getTemplateExportDimensions(template);
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(dims.width, dims.height);
  const w = dims.width / divisor;
  const h = dims.height / divisor;
  return `${w}/${h}`;
}

