import fs from 'fs/promises';
import path from 'path';
import sanitizeHtml from 'sanitize-html';

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
    const rawHtml = await fs.readFile(filePath, 'utf-8');

    // Rewrite internal HTML links: something.html -> /something
    let processedHtml = rawHtml.replace(
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
    const sanitized = sanitizeHtml(processedHtml, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        'img', 'figure', 'figcaption', 'video', 'audio', 'source',
        'iframe', 'style', 'main', 'section', 'article', 'header',
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
        'button': ['type', 'name', 'value', 'disabled'],
        'input': ['type', 'name', 'value', 'placeholder', 'required', 'disabled', 'checked'],
        'form': ['action', 'method', 'enctype'],
        'label': ['for'],
        'select': ['name', 'required', 'disabled'],
        'option': ['value', 'selected'],
        'textarea': ['name', 'rows', 'cols', 'placeholder', 'required', 'disabled'],
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
      allowVulnerableTags: false,
    });

    return sanitized;
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
