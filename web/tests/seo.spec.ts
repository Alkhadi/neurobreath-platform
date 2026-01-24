/**
 * SEO E2E Tests
 * 
 * Validates SEO implementation across key pages using Playwright
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Key pages to test
const PAGES_TO_TEST = [
  { path: '/uk', title: 'NeuroBreath' },
  { path: '/adhd', title: 'ADHD' },
  { path: '/anxiety', title: 'Anxiety' },
  { path: '/autism', title: 'Autism' },
  { path: '/breathing', title: 'Breathing' },
  { path: '/tools', title: 'Tools' },
  { path: '/coach', title: 'Coach' },
  { path: '/blog', title: 'Blog' },
];

test.describe('SEO Meta Tags', () => {
  for (const page of PAGES_TO_TEST) {
    test(`${page.path} has proper meta tags`, async ({ page: playwright }) => {
      await playwright.goto(`${BASE_URL}${page.path}`);

      // Check title
      const title = await playwright.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThan(70);
      expect(title).toContain(page.title);

      // Check meta description
      const metaDescription = await playwright.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toBeTruthy();
      expect(metaDescription!.length).toBeGreaterThan(100);
      expect(metaDescription!.length).toBeLessThan(170);

      // Check canonical URL
      const canonical = await playwright.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBeTruthy();
      expect(canonical).toContain(page.path);

      // Check Open Graph tags
      const ogTitle = await playwright.locator('meta[property="og:title"]').getAttribute('content');
      const ogDescription = await playwright.locator('meta[property="og:description"]').getAttribute('content');
      const ogImage = await playwright.locator('meta[property="og:image"]').getAttribute('content');
      const ogUrl = await playwright.locator('meta[property="og:url"]').getAttribute('content');

      expect(ogTitle).toBeTruthy();
      expect(ogDescription).toBeTruthy();
      expect(ogImage).toBeTruthy();
      expect(ogUrl).toContain(page.path);

      // Check Twitter Card tags
      const twitterCard = await playwright.locator('meta[name="twitter:card"]').getAttribute('content');
      const twitterTitle = await playwright.locator('meta[name="twitter:title"]').getAttribute('content');
      const twitterDescription = await playwright.locator('meta[name="twitter:description"]').getAttribute('content');

      expect(twitterCard).toBe('summary_large_image');
      expect(twitterTitle).toBeTruthy();
      expect(twitterDescription).toBeTruthy();
    });
  }
});

test.describe('Heading Structure', () => {
  for (const page of PAGES_TO_TEST) {
    test(`${page.path} has proper heading hierarchy`, async ({ page: playwright }) => {
      await playwright.goto(`${BASE_URL}${page.path}`);

      // Check for exactly one H1
      const h1Elements = await playwright.locator('h1').all();
      expect(h1Elements.length).toBe(1);

      // Get H1 text
      const h1Text = await playwright.locator('h1').first().textContent();
      expect(h1Text).toBeTruthy();
      expect(h1Text!.length).toBeGreaterThan(5);

      // Check for H2 elements
      const h2Elements = await playwright.locator('h2').all();
      expect(h2Elements.length).toBeGreaterThan(0);
    });
  }
});

test.describe('Structured Data', () => {
  for (const page of PAGES_TO_TEST) {
    test(`${page.path} has valid JSON-LD structured data`, async ({ page: playwright }) => {
      await playwright.goto(`${BASE_URL}${page.path}`);

      // Find all JSON-LD script tags
      const jsonLdScripts = await playwright.locator('script[type="application/ld+json"]').all();
      expect(jsonLdScripts.length).toBeGreaterThan(0);

      // Validate each JSON-LD block
      for (const script of jsonLdScripts) {
        const content = await script.textContent();
        expect(content).toBeTruthy();

        // Parse and validate JSON
        let parsedData;
        try {
          parsedData = JSON.parse(content!);
        } catch (e) {
          throw new Error(`Invalid JSON-LD on ${page.path}: ${e}`);
        }

        // Check for required schema.org properties
        expect(parsedData['@context']).toBe('https://schema.org');
        expect(parsedData['@type'] || parsedData['@graph']).toBeTruthy();
      }
    });
  }
});

test.describe('Accessibility', () => {
  for (const page of PAGES_TO_TEST) {
    test(`${page.path} has proper lang attribute`, async ({ page: playwright }) => {
      await playwright.goto(`${BASE_URL}${page.path}`);

      const htmlLang = await playwright.locator('html').getAttribute('lang');
      expect(htmlLang).toBe('en-GB');
    });

    test(`${page.path} has skip link`, async ({ page: playwright }) => {
      await playwright.goto(`${BASE_URL}${page.path}`);

      // Check for skip to main content link (if present)
      const skipLink = playwright.locator('a[href="#main-content"]').first();
      const skipLinkCount = await skipLink.count();

      // If skip link exists, verify it's functional
      if (skipLinkCount > 0) {
        const href = await skipLink.getAttribute('href');
        expect(href).toBe('#main-content');
      }
    });
  }
});

test.describe('Technical SEO', () => {
  test('sitemap.xml is accessible', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/sitemap.xml`);
    expect(response.status()).toBe(200);

    const content = await response.text();
    expect(content).toContain('<?xml');
    expect(content).toContain('<urlset');
    expect(content).toContain('<url>');
  });

  test('robots.txt is accessible', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/robots.txt`);
    expect(response.status()).toBe(200);

    const content = await response.text();
    expect(content.toLowerCase()).toContain('user-agent:');
    expect(content).toContain('Sitemap:');
  });

  test('manifest.json is accessible', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/manifest.json`);
    expect(response.status()).toBe(200);

    const content = await response.text();
    const manifest = JSON.parse(content);
    
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.icons).toBeTruthy();
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThan(0);
  });
});

test.describe('Images', () => {
  test('Homepage images have alt text', async ({ page }) => {
    await page.goto(`${BASE_URL}/uk`);

    // Get all images (excluding decorative ones)
    const images = await page.locator('img:not([aria-hidden="true"])').all();

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');

      // Image should either have alt text or be marked as presentation
      expect(alt !== null || role === 'presentation').toBeTruthy();

      // If alt exists and isn't empty, check it's meaningful (not just filename)
      if (alt && alt.length > 0) {
        expect(alt).not.toMatch(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
      }
    }
  });
});

test.describe('Performance & Core Web Vitals', () => {
  test('Homepage loads within reasonable time', async ({ page }) => {
    // Warm-up request: on a clean dev server, the first hit can include Next.js compilation.
    await page.goto(`${BASE_URL}/uk`, { waitUntil: 'domcontentloaded' });

    const startTime = Date.now();
    // `networkidle` can be noisy in dev (HMR, long-polls, analytics). Use DOMContentLoaded.
    await page.reload({ waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;

    // Dev server can be slow (especially on first device project). Keep this a sanity check, not a strict perf gate.
    expect(loadTime).toBeLessThan(8000);
  });

  test('No console errors on homepage', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto(`${BASE_URL}/uk`);
    
    // Allow some time for any lazy-loaded scripts
    await page.waitForTimeout(2000);

    // Filter out expected/acceptable errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('extension') &&
      !error.includes('DevTools')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
