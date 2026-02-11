/**
 * NB-Card SVG Sanitizer
 * 
 * Provides XSS protection for user-uploaded SVG templates and images.
 * Implements a whitelist-based approach without external dependencies.
 * 
 * Security Goals:
 * - Block JavaScript execution (<script>, on* attributes, javascript: URLs)
 * - Block external resource loading (except safe <use> references)
 * - Preserve safe SVG presentation elements
 * - Maintain template functionality (text substitution, styling)
 */

/**
 * Allowed SVG elements (presentation only, no scripting)
 */
const ALLOWED_SVG_ELEMENTS = new Set([
  // Basic shapes
  'svg', 'g', 'defs', 'symbol', 'use', 'clipPath', 'mask',
  'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'path',
  // Text
  'text', 'tspan', 'textPath',
  // Gradients & patterns
  'linearGradient', 'radialGradient', 'stop', 'pattern',
  // Filters (safe presentation effects)
  'filter', 'feGaussianBlur', 'feOffset', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feFlood', 'feImage', 'feMorphology',
  // Images (will be validated separately)
  'image',
  // Metadata (safe descriptive elements)
  'title', 'desc', 'metadata',
]);

/**
 * Allowed SVG attributes (excluding event handlers and javascript: URLs)
 */
const ALLOWED_SVG_ATTRIBUTES = new Set([
  // Geometry
  'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry',
  'width', 'height', 'd', 'points', 'transform',
  // Styling
  'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin',
  'opacity', 'fill-opacity', 'stroke-opacity',
  'font-family', 'font-size', 'font-weight', 'font-style', 'text-anchor',
  'dominant-baseline', 'letter-spacing',
  // Filters & effects
  'filter', 'clip-path', 'mask', 'style',
  // Gradients
  'offset', 'stop-color', 'stop-opacity', 'gradientUnits', 'gradientTransform',
  'x1', 'y1', 'x2', 'y2', 'fx', 'fy', 'fr',
  // Structure
  'id', 'class', 'viewBox', 'preserveAspectRatio', 'xmlns', 'xmlns:xlink',
  // Safe xlink (only #id references)
  'xlink:href', 'href',
  // Template substitution (our custom data attributes)
  'data-field', 'data-field-type', 'data-placeholder',
]);

/**
 * Dangerous attribute patterns (will be removed)
 */
const DANGEROUS_PATTERNS = [
  /^on/i,                    // onClick, onLoad, etc.
  /^javascript:/i,           // javascript: URLs
  /^data:/i,                 // data: URLs (except safe image formats)
  /^vbscript:/i,             // vbscript: URLs
  /<script/i,                // Inline scripts
  /javascript:/i,            // JavaScript anywhere
  /expression\(/i,           // CSS expression()
];

/**
 * Validate href/xlink:href to ensure it's a safe reference
 */
function isSafeHref(value: string): boolean {
  const trimmed = value.trim();
  
  // Allow #id references (internal SVG references)
  if (trimmed.startsWith('#')) return true;
  
  // Allow relative paths to our own templates
  if (trimmed.startsWith('/nb-card/templates/')) return true;
  
  // Block everything else (external URLs, data: URIs, javascript:, etc.)
  return false;
}

/**
 * Validate data: URL to ensure it's a safe image format
 */
function isSafeDataUrl(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  
  // Only allow image/* MIME types
  if (!trimmed.startsWith('data:image/')) return false;
  
  // Allow PNG, JPEG, SVG, WebP
  if (trimmed.startsWith('data:image/png;base64,')) return true;
  if (trimmed.startsWith('data:image/jpeg;base64,')) return true;
  if (trimmed.startsWith('data:image/jpg;base64,')) return true;
  if (trimmed.startsWith('data:image/webp;base64,')) return true;
  if (trimmed.startsWith('data:image/svg+xml;base64,')) return true;
  
  return false;
}

/**
 * Sanitize attribute value
 */
function sanitizeAttributeValue(name: string, value: string): string | null {
  const trimmed = value.trim();
  
  // Check href/xlink:href safety
  if (name === 'href' || name === 'xlink:href') {
    // Special case: allow safe data: URLs for images
    if (trimmed.startsWith('data:')) {
      return isSafeDataUrl(trimmed) ? trimmed : null;
    }
    return isSafeHref(trimmed) ? trimmed : null;
  }
  
  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(trimmed)) return null;
  }
  
  // Style attribute: basic CSS sanitization
  if (name === 'style') {
    return sanitizeStyleAttribute(trimmed);
  }
  
  return trimmed;
}

/**
 * Sanitize inline style attribute (remove dangerous CSS)
 */
function sanitizeStyleAttribute(style: string): string | null {
  // Remove javascript:, expression(), and other dangerous constructs
  const cleaned = style
    .replace(/javascript:/gi, '')
    .replace(/expression\(/gi, '')
    .replace(/-moz-binding:/gi, '')
    .replace(/behavior:/gi, '')
    .replace(/@import/gi, '');
  
  // If significantly modified, reject it
  if (cleaned.length < style.length * 0.5) return null;
  
  return cleaned.trim() || null;
}

/**
 * Sanitize SVG content (string-based approach)
 * 
 * @param svgContent - Raw SVG markup
 * @returns Sanitized SVG string, or null if critically invalid
 */
export function sanitizeSVG(svgContent: string): string | null {
  if (typeof svgContent !== 'string') return null;
  
  const trimmed = svgContent.trim();
  if (!trimmed) return null;
  
  try {
    // Parse SVG into DOM (server-safe: use DOMParser if available, regex fallback)
    const parser = typeof DOMParser !== 'undefined' ? new DOMParser() : null;
    
    if (!parser) {
      // Fallback: basic regex sanitization for Node.js environments
      return sanitizeSVGRegex(trimmed);
    }
    
    // Browser: use DOMParser for accurate parsing
    const doc = parser.parseFromString(trimmed, 'image/svg+xml');
    
    // Check for parser errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      console.warn('[SVG Sanitizer] Parse error:', parserError.textContent);
      return null;
    }
    
    const svg = doc.documentElement;
    if (svg.nodeName.toLowerCase() !== 'svg') {
      console.warn('[SVG Sanitizer] Root element is not <svg>');
      return null;
    }
    
    // Recursively sanitize elements
    sanitizeElement(svg);
    
    // Serialize back to string
    return new XMLSerializer().serializeToString(svg);
    
  } catch (error) {
    console.error('[SVG Sanitizer] Error:', error);
    return null;
  }
}

/**
 * Recursively sanitize an SVG element
 */
function sanitizeElement(element: Element): void {
  const tagName = element.nodeName.toLowerCase();
  
  // Remove disallowed elements
  if (!ALLOWED_SVG_ELEMENTS.has(tagName)) {
    element.remove();
    return;
  }
  
  // Remove dangerous attributes
  const attributesToRemove: string[] = [];
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    const attrName = attr.name.toLowerCase();
    
    // Remove event handlers
    if (attrName.startsWith('on')) {
      attributesToRemove.push(attr.name);
      continue;
    }
    
    // Check if attribute is allowed
    if (!ALLOWED_SVG_ATTRIBUTES.has(attrName)) {
      attributesToRemove.push(attr.name);
      continue;
    }
    
    // Sanitize attribute value
    const sanitizedValue = sanitizeAttributeValue(attrName, attr.value);
    if (sanitizedValue === null) {
      attributesToRemove.push(attr.name);
    } else if (sanitizedValue !== attr.value) {
      element.setAttribute(attr.name, sanitizedValue);
    }
  }
  
  // Remove dangerous attributes
  attributesToRemove.forEach(attrName => element.removeAttribute(attrName));
  
  // Recursively sanitize children
  Array.from(element.children).forEach(child => sanitizeElement(child));
}

/**
 * Fallback: Regex-based SVG sanitization for Node.js
 * Less precise than DOM parsing, but sufficient for basic safety
 */
function sanitizeSVGRegex(svgContent: string): string | null {
  let cleaned = svgContent;
  
  // Remove <script> tags
  cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '');
  
  // Remove event handler attributes
  cleaned = cleaned.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
  cleaned = cleaned.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, '');
  
  // Remove javascript: URLs
  cleaned = cleaned.replace(/javascript:[^"'\s]*/gi, '');
  cleaned = cleaned.replace(/["']javascript:[^"']*["']/gi, '""');
  
  // Remove vbscript: and data: URLs (except in safe contexts)
  cleaned = cleaned.replace(/vbscript:[^"'\s]*/gi, '');
  
  // Remove dangerous CSS
  cleaned = cleaned.replace(/expression\([^)]*\)/gi, '');
  cleaned = cleaned.replace(/-moz-binding:[^;]*/gi, '');
  
  // If too much was removed, reject
  if (cleaned.length < svgContent.length * 0.5) {
    console.warn('[SVG Sanitizer] Content too heavily modified, rejecting');
    return null;
  }
  
  return cleaned;
}

/**
 * Validate file type (for image uploads)
 */
export function isValidImageType(file: File): boolean {
  // Accept common image formats
  const validTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/svg+xml',
  ];
  
  return validTypes.includes(file.type.toLowerCase());
}

/**
 * Validate file size (for image uploads)
 * @param file - File to check
 * @param maxSizeMB - Maximum file size in megabytes (default: 5MB)
 */
export function isValidImageSize(file: File, maxSizeMB: number = 5): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
}

/**
 * Comprehensive image upload validation
 */
export function validateImageUpload(file: File): { valid: boolean; error?: string } {
  // Check type
  if (!isValidImageType(file)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload PNG, JPEG, or WebP images.',
    };
  }
  
  // Check size
  if (!isValidImageSize(file, 5)) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 5MB.',
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

/**
 * Sanitize SVG file upload
 */
export async function sanitizeSVGFile(file: File): Promise<string | null> {
  if (!file.type.includes('svg')) {
    console.warn('[SVG Sanitizer] File is not SVG');
    return null;
  }
  
  try {
    const content = await file.text();
    return sanitizeSVG(content);
  } catch (error) {
    console.error('[SVG Sanitizer] Failed to read file:', error);
    return null;
  }
}
