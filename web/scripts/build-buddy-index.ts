#!/usr/bin/env ts-node
/**
 * Build-time script: Generate NeuroBreath Buddy Internal Index
 * Scans page.tsx files and generates JSON index for RAG-based search
 * 
 * Usage: yarn buddy:index
 */

import fs from 'fs';
import path from 'path';
// @ts-expect-error - glob types not available in repo
import glob from 'glob';

interface PageFrontmatter {
  title?: string;
  description?: string;
  audiences?: string[];
  keyTopics?: string[];
}

interface ParsedPage {
  filePath: string;
  path: string;
  title: string;
  description?: string;
  headings: Array<{ text: string; id: string; level: number }>;
  anchors: string[];
  audiences: string[];
  keyTopics: string[];
  toolLinks?: Array<{ toolId: string; toolName: string; description?: string }>;
  regionSpecific?: { regions: ('uk' | 'us')[]; canonical?: string };
  lastUpdated: string;
  isPublished: boolean;
}

const WEB_APP_DIR = path.join(__dirname, '..', 'app');
// Write the generated index into the Next.js public directory so it is served at /generated/
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'generated');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'buddy-internal-index.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function getPageMetadata(filePath: string): Promise<PageFrontmatter> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    const metadata: PageFrontmatter = {};

    // Extract title from headings or component props
    const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
    if (titleMatch) {
      metadata.title = titleMatch[1];
    }

    // Look for JSDoc comments
    if (content.includes('@description')) {
      const descMatch = content.match(/@description\s+([\s\S]*?)(?:@|$)/);
      if (descMatch) {
        metadata.description = descMatch[1].trim().split('\n')[0];
      }
    }

    return metadata;
  } catch {
    return {};
  }
}

function extractHeadings(filePath: string): { text: string; id: string; level: number }[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const headings: { text: string; id: string; level: number }[] = [];

    // Match <h1>, <h2>, <h3> tags
    const matches = content.matchAll(/<h([1-6])(?:\s+id=["']([^"']+)["'])?[^>]*>([^<]+)<\/h\1>/g);

    for (const match of matches) {
      const level = parseInt(match[1]);
      const id = match[2] || generateId(match[3]);
      const text = match[3].trim();

      headings.push({ text, id, level });
    }

    return headings;
  } catch {
    return [];
  }
}

function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function routePathToPagePath(filePath: string): string {
  // Convert /web/app/adhd/page.tsx -> /adhd
  const relative = path.relative(WEB_APP_DIR, filePath);
  const directory = path.dirname(relative);
  const pagePath = directory === '.' ? '/' : `/${directory}`;
  return pagePath.replace(/\\/g, '/');
}

function detectRegionSpecific(pagePath: string): { regions: ('uk' | 'us')[]; canonical?: string } | undefined {
  if (pagePath.startsWith('/uk/')) {
    return {
      regions: ['uk'],
      canonical: pagePath.replace(/^\/uk/, '')
    };
  }
  if (pagePath.startsWith('/us/')) {
    return {
      regions: ['us'],
      canonical: pagePath.replace(/^\/us/, '')
    };
  }
  return undefined;
}

async function parsePageFiles(): Promise<ParsedPage[]> {
  const pages: ParsedPage[] = [];

  // Find all page.tsx files in the app directory
    const pageFiles = glob.sync(path.join(WEB_APP_DIR, '**', 'page.tsx'), {
    ignore: [
      path.join(WEB_APP_DIR, '**', 'node_modules', '**'),
      path.join(WEB_APP_DIR, '**', '.next', '**')
    ]
  });

  console.log(`[Buddy Index] Found ${pageFiles.length} page files`);

  for (const filePath of pageFiles) {
    const pagePath = routePathToPagePath(filePath);
    const metadata = await getPageMetadata(filePath);
    const headings = extractHeadings(filePath);

    // Default publish status to true unless explicitly marked otherwise
    const isPublished = !filePath.includes('.draft');

    const page: ParsedPage = {
      filePath,
      path: pagePath,
      title: metadata.title || pagePath.split('/').pop()?.replace(/-/g, ' ') || pagePath,
      description: metadata.description,
      headings,
      anchors: headings.map((h) => h.id),
      audiences: metadata.audiences || ['all'],
      keyTopics: metadata.keyTopics || [],
      regionSpecific: detectRegionSpecific(pagePath),
      lastUpdated: new Date().toISOString(),
      isPublished
    };

    pages.push(page);
  }

  return pages;
}

async function main() {
  try {
    console.log('[Buddy Index] Generating internal knowledge index...');

    const pages = await parsePageFiles();

    const index = {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      pages: pages.sort((a, b) => a.path.localeCompare(b.path))
    };

    // Write index file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));

    console.log(`[Buddy Index] ✓ Generated index with ${pages.length} pages`);
    console.log(`[Buddy Index] Output: ${OUTPUT_FILE}`);

    // Print coverage summary
    const audiences = new Set<string>();
    const topics = new Set<string>();

    pages.forEach((page) => {
      page.audiences.forEach((a) => audiences.add(a));
      page.keyTopics.forEach((t) => topics.add(t));
    });

    console.log(`[Buddy Index] Coverage: ${audiences.size} audience types, ${topics.size} topics`);
    console.log(`[Buddy Index] Done!`);
  } catch (error) {
    console.error('[Buddy Index] Error:', error);
    process.exit(1);
  }
}

main();
