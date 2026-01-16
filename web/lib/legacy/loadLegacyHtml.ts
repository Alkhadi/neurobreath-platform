import fs from 'fs/promises';
import path from 'path';
import sanitizeHtml from 'sanitize-html';

/**
 * Fixes accessibility issues in HTML by adding missing IDs and associating labels
 * @param html - HTML string to fix
 * @returns Fixed HTML string
 */
function fixFormAccessibility(html: string): string {
  // Counter for generating unique IDs
  let idCounter = 0;
  const generateId = (prefix: string) => `${prefix}-${Date.now()}-${++idCounter}`;
  
  // Use DOMParser-like approach with regex (server-side compatible)
  let fixedHtml = html;
  
  // Fix 1: Add ID and name to inputs that don't have them
  fixedHtml = fixedHtml.replace(
    /<input\s+([^>]*?)>/gi,
    (match, attrs) => {
      // Check if already has id
      const hasId = /\bid\s*=\s*["'][^"']+["']/i.test(attrs);
      // Check if already has name
      const hasName = /\bname\s*=\s*["'][^"']+["']/i.test(attrs);
      
      if (!hasId || !hasName) {
        const newId = hasId ? null : generateId('input');
        const newName = hasName ? null : generateId('field');
        
        let newAttrs = attrs;
        if (!hasId && newId) {
          newAttrs += ` id="${newId}"`;
        }
        if (!hasName && newName) {
          newAttrs += ` name="${newName}"`;
        }
        
        return `<input ${newAttrs}>`;
      }
      return match;
    }
  );
  
  // Fix 2: Add ID and name to select elements
  fixedHtml = fixedHtml.replace(
    /<select\s+([^>]*?)>/gi,
    (match, attrs) => {
      const hasId = /\bid\s*=\s*["'][^"']+["']/i.test(attrs);
      const hasName = /\bname\s*=\s*["'][^"']+["']/i.test(attrs);
      
      if (!hasId || !hasName) {
        const newId = hasId ? null : generateId('select');
        const newName = hasName ? null : generateId('field');
        
        let newAttrs = attrs;
        if (!hasId && newId) {
          newAttrs += ` id="${newId}"`;
        }
        if (!hasName && newName) {
          newAttrs += ` name="${newName}"`;
        }
        
        return `<select ${newAttrs}>`;
      }
      return match;
    }
  );
  
  // Fix 3: Add ID and name to textarea elements
  fixedHtml = fixedHtml.replace(
    /<textarea\s+([^>]*?)>/gi,
    (match, attrs) => {
      const hasId = /\bid\s*=\s*["'][^"']+["']/i.test(attrs);
      const hasName = /\bname\s*=\s*["'][^"']+["']/i.test(attrs);
      
      if (!hasId || !hasName) {
        const newId = hasId ? null : generateId('textarea');
        const newName = hasName ? null : generateId('field');
        
        let newAttrs = attrs;
        if (!hasId && newId) {
          newAttrs += ` id="${newId}"`;
        }
        if (!hasName && newName) {
          newAttrs += ` name="${newName}"`;
        }
        
        return `<textarea ${newAttrs}>`;
      }
      return match;
    }
  );
  
  // Fix 4: Associate labels with form fields
  // Find labels without 'for' attribute and try to associate them
  fixedHtml = fixedHtml.replace(
    /<label\s+([^>]*?)>([\s\S]*?)<\/label>/gi,
    (match, attrs, content) => {
      // Check if label already has 'for' attribute
      const hasFor = /\bfor\s*=\s*["'][^"']+["']/i.test(attrs);
      
      if (!hasFor) {
        // Look for an input/select/textarea inside the label
        const inputMatch = /<(input|select|textarea)\s+([^>]*?)>/i.exec(content);
        
        if (inputMatch) {
          const [, tagName, inputAttrs] = inputMatch;
          
          // Extract or create ID for the input
          const idMatch = /\bid\s*=\s*["']([^"']+)["']/i.exec(inputAttrs);
          const inputId = idMatch ? idMatch[1] : generateId(tagName);
          
          // If no ID, add it to the input
          if (!idMatch) {
            const updatedInput = inputMatch[0].replace(
              /<(input|select|textarea)\s+([^>]*?)>/i,
              `<$1 $2 id="${inputId}">`
            );
            const updatedContent = content.replace(inputMatch[0], updatedInput);
            return `<label ${attrs} for="${inputId}">${updatedContent}</label>`;
          } else {
            // Just add 'for' to the label
            return `<label ${attrs} for="${inputId}">${content}</label>`;
          }
        }
      }
      
      return match;
    }
  );
  
  return fixedHtml;
}

/**
 * Loads and sanitizes a legacy HTML file from the content/legacy/pages directory.
 * Rewrites internal links and asset paths to work within the Next.js app.
 * 
 * @param filename - The name of the HTML file (e.g., "about.html")
 * @returns Sanitized HTML string with rewritten paths
 */
export async function loadLegacyHtml(filename: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'content', 'legacy', 'pages', filename);
    
    // Try to read the file, return placeholder if it doesn't exist
    let rawHtml: string;
    try {
      rawHtml = await fs.readFile(filePath, 'utf-8');
    } catch (err: any) {
      if (err?.code === 'ENOENT') {
        // File doesn't exist - return a graceful placeholder
        console.warn(`Legacy HTML file not found: ${filename} - returning placeholder`);
        return `
          <div class="container mx-auto px-4 py-12">
            <div class="max-w-2xl mx-auto">
              <h1 class="text-3xl font-bold mb-4">Content Coming Soon</h1>
              <p class="text-gray-600 mb-4">
                This resource is currently being updated. Please check back soon!
              </p>
              <p class="text-sm text-gray-500">
                Missing file: ${filename}
              </p>
            </div>
          </div>
        `;
      }
      throw err;
    }

    // Remove legacy site header and footer elements to avoid duplicates with Next.js layout
    let processedHtml = rawHtml
      // Remove only the top-level site header
      .replace(/<header[^>]*class=["'][^"']*site-header[^"']*["'][^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<nav[^>]*class=["'][^"']*header[^"']*["'][^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<!-- Header Start -->[\s\S]*?<!-- Header End -->/gi, '')
      // Remove footer elements
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<!-- Footer Start -->[\s\S]*?<!-- Footer End -->/gi, '');

    // Rewrite internal HTML links: something.html -> /something
    processedHtml = processedHtml.replace(
      /href=["']([^"']*\.html)["']/gi,
      (match, href) => {
        // Skip external links and anchors
        if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#')) {
          return match;
        }
        // Remove .html extension and ensure leading slash
        const cleanPath = href.replace(/\.html$/, '').replace(/^\.\//, '/');
        return `href="${cleanPath}"`;
      }
    );

    // Rewrite asset paths to point to /legacy-assets/
    // Matches: src="assets/...", src="images/...", href="css/...", src="js/...", etc.
    processedHtml = processedHtml.replace(
      /(src|href)=["'](?!http|https|\/\/|#|data:)([^"']*)["']/gi,
      (match, attr, assetPath) => {
        // Skip already processed paths
        if (assetPath.startsWith('/legacy-assets/') || assetPath.startsWith('/')) {
          return match;
        }
        // Add /legacy-assets/ prefix
        const cleanPath = assetPath.replace(/^\.\//, '');
        return `${attr}="/legacy-assets/${cleanPath}"`;
      }
    );

    // Sanitize HTML while allowing common content tags and attributes
    // Note: 'style' tag is intentionally excluded to prevent XSS vulnerabilities
    const sanitized = sanitizeHtml(processedHtml, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        'img', 'figure', 'figcaption', 'video', 'audio', 'source',
        'iframe', 'main', 'section', 'article', 'header',
        'footer', 'nav', 'aside', 'details', 'summary', 'time',
        'mark', 'ruby', 'rt', 'rp', 'bdi', 'wbr', 'picture'
      ]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        '*': ['class', 'id', 'style', 'data-*'],
        'img': ['src', 'alt', 'title', 'width', 'height', 'loading', 'srcset', 'sizes'],
        'video': ['src', 'controls', 'width', 'height', 'poster', 'preload', 'autoplay', 'loop', 'muted'],
        'audio': ['src', 'controls', 'preload', 'autoplay', 'loop', 'muted'],
        'source': ['src', 'type'],
        'iframe': ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen'],
        'a': ['href', 'title', 'target', 'rel'],
        'button': ['type', 'name', 'value', 'disabled', 'id', 'aria-label'],
        'input': ['type', 'name', 'id', 'value', 'placeholder', 'required', 'disabled', 'checked', 'aria-label', 'aria-describedby'],
        'form': ['action', 'method', 'enctype'],
        'label': ['for', 'id'],
        'select': ['name', 'id', 'required', 'disabled', 'aria-label'],
        'option': ['value', 'selected'],
        'textarea': ['name', 'id', 'rows', 'cols', 'placeholder', 'required', 'disabled', 'aria-label'],
      },
      allowedSchemes: ['http', 'https', 'mailto', 'tel', 'data'],
      allowedSchemesByTag: {
        img: ['http', 'https', 'data'],
        iframe: ['https'],
      },
      // Allow all CSS properties in style attributes
      allowedStyles: {
        '*': {
          // Allow all style properties
          'color': [/.*/],
          'background': [/.*/],
          'background-color': [/.*/],
          'font-size': [/.*/],
          'font-weight': [/.*/],
          'text-align': [/.*/],
          'padding': [/.*/],
          'margin': [/.*/],
          'display': [/.*/],
          'width': [/.*/],
          'height': [/.*/],
          'border': [/.*/],
          'position': [/.*/],
          'top': [/.*/],
          'right': [/.*/],
          'bottom': [/.*/],
          'left': [/.*/],
          'flex': [/.*/],
          'grid': [/.*/],
          'opacity': [/.*/],
          'transform': [/.*/],
          'transition': [/.*/],
          'animation': [/.*/],
        }
      },
      // Disallow scripts for security
      disallowedTagsMode: 'discard',
      // Note: style tags removed from allowedTags to prevent XSS
      allowVulnerableTags: false,
    });

    // Post-process to fix form field accessibility issues
    const accessibleHtml = fixFormAccessibility(sanitized);

    return accessibleHtml;
  } catch (error) {
    console.error(`Error loading legacy HTML file: ${filename}`, error);
    throw new Error(`Failed to load legacy HTML: ${filename}`);
  }
}

/**
 * Gets a list of all available legacy HTML files
 */
export async function listLegacyPages(): Promise<string[]> {
  try {
    const pagesDir = path.join(process.cwd(), 'content', 'legacy', 'pages');
    const files = await fs.readdir(pagesDir);
    return files.filter(file => file.endsWith('.html'));
  } catch (error) {
    console.error('Error listing legacy pages:', error);
    return [];
  }
}
