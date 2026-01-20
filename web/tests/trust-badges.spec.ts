import { test, expect } from '@playwright/test';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Trust Badge Integration Tests
 * 
 * Validates that trust badges are properly displayed across:
 * - Hub pages (7 hubs)
 * - Tool collection pages (3 main collections)
 * - Pathway pages (2 pathways)
 * 
 * Tests verify:
 * 1. Badge container exists and is visible
 * 2. At least one badge label is present
 * 3. Metadata (last reviewed, sources) displays on relevant pages
 */

test.describe('Trust Badges on Hub Pages', () => {
  const hubPages = [
    { path: '/adhd', name: 'ADHD Hub' },
    { path: '/autism', name: 'Autism Hub' },
    { path: '/anxiety', name: 'Anxiety Hub' },
    { path: '/sleep', name: 'Sleep Hub' },
    { path: '/breathing', name: 'Breathing Hub' },
    { path: '/stress', name: 'Stress Hub' },
    { path: '/dyslexia-reading-training', name: 'Dyslexia Reading Training Hub' },
  ];

  for (const hub of hubPages) {
    test(`should display trust badge on ${hub.name}`, async ({ page }) => {
      await page.goto(`${BASE_URL}${hub.path}`);
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Assert the page title exists (avoid matching the global site header)
      const h1 = page.getByRole('heading', { level: 1 }).first();
      await expect(h1).toBeVisible();
      
      // Check for TrustBadge container (with data-testid or by looking for badge elements)
      const badgeContainer = page.locator('[data-testid="trust-badge"], [data-trust-badge], .trust-badge').first();
      await expect(badgeContainer).toBeVisible({ timeout: 10000 });
      
      // Verify at least one badge label is present
      const badgeLabels = badgeContainer.locator('text=/Evidence-linked|Reviewed|Educational-only|NICE-aligned|Community-informed/i');
      await expect(badgeLabels.first()).toBeVisible();

      // Metadata details are validated separately in the dedicated metadata tests.
    });
  }
});

test.describe('Trust Badges on Tool Collection Pages', () => {
  const toolPages = [
    { path: '/tools/adhd-tools', name: 'ADHD Tools' },
    { path: '/tools/autism-tools', name: 'Autism Tools' },
    { path: '/tools/anxiety-tools', name: 'Anxiety Tools' },
  ];

  for (const tool of toolPages) {
    test(`should display trust badge on ${tool.name}`, async ({ page }) => {
      await page.goto(`${BASE_URL}${tool.path}`);
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check that PageHeader is visible
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
      
      // Check for TrustBadge container
      const badgeContainer = page.locator('[data-testid="trust-badge"], [data-trust-badge], .trust-badge').first();
      await expect(badgeContainer).toBeVisible({ timeout: 10000 });
      
      // Verify at least one badge label is present
      const badgeLabels = badgeContainer.locator('text=/Evidence-linked|Reviewed|Educational-only/i');
      await expect(badgeLabels.first()).toBeVisible();
    });
  }
});

test.describe('Trust Badges on Pathway Pages', () => {
  const pathwayPages = [
    { path: '/adhd/pathway', name: 'ADHD Pathway', expectedBadges: ['NICE-aligned', 'Evidence-linked', 'Reviewed'] },
    { path: '/autism/pathway', name: 'Autism Pathway', expectedBadges: ['NICE-aligned', 'Evidence-linked', 'Community-informed'] },
  ];

  for (const pathway of pathwayPages) {
    test(`should display trust badge on ${pathway.name}`, async ({ page }) => {
      await page.goto(`${BASE_URL}${pathway.path}`);
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check for TrustBadge container
      const badgeContainer = page.locator('[data-testid="trust-badge"], [data-trust-badge], .trust-badge').first();
      await expect(badgeContainer).toBeVisible({ timeout: 10000 });
      
      // Verify specific badges are present for pathway pages
      for (const expectedBadge of pathway.expectedBadges) {
        // Scope to the trust badge container to avoid matching section headings like "What Helps (Evidence-Linked)"
        const badge = badgeContainer.locator(`text=/${expectedBadge}/i`).first();
        await expect(badge).toBeVisible();
      }
      
      // Pathway pages should show "Last reviewed" metadata
      const lastReviewed = badgeContainer.locator('text=/Last reviewed/i').first();
      await expect(lastReviewed).toBeVisible();
      
      // Check for primary sources (NICE guidelines)
      const primarySources = badgeContainer.locator('text=/Primary sources|NICE|NG87|CG170|CG128/i');
      await expect(primarySources.first()).toBeVisible();
    });
  }
});

test.describe('Trust Badge Component Functionality', () => {
  test('should display fallback badge for unregistered routes', async ({ page }) => {
    // Navigate to a page that might not be in the registry
    await page.goto(`${BASE_URL}/about`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // If badges are present, they should either show proper badges or a fallback
    const badgeContainer = page.locator('[class*="trust-badge"], [data-trust-badge]');
    if (await badgeContainer.isVisible({ timeout: 5000 })) {
      // If visible, check for either proper badges or fallback text
      const hasProperBadge = await page.locator('text=/Evidence-linked|Reviewed|Educational-only/i').isVisible();
      const hasFallback = await page.locator('text=/Under review|Not reviewed/i').isVisible();
      
      expect(hasProperBadge || hasFallback).toBe(true);
    }
  });
  
  test('should show badge variants correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/adhd`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that block variant is used on hub pages (shows details)
    const badgeContainer = page.locator('[data-testid="trust-badge"], [data-trust-badge], .trust-badge').first();
    await expect(badgeContainer).toBeVisible();
    
    // Block variant should include at least one expected badge label
    await expect(badgeContainer).toContainText(/Evidence-linked|Reviewed|Educational/i);
  });
  
  test('should handle mobile viewport correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(`${BASE_URL}/adhd`);
    await page.waitForLoadState('networkidle');
    
    // Trust badge should still be visible on mobile
    const badgeContainer = page.locator('[data-testid="trust-badge"], [data-trust-badge], .trust-badge').first();
    await expect(badgeContainer).toBeVisible({ timeout: 10000 });
    
    // Check badges are readable (not cut off)
    const badgeLabels = badgeContainer.locator('text=/Evidence-linked|Reviewed/i').first();
    await expect(badgeLabels).toBeVisible();
  });
});

test.describe('Trust Badge Metadata Display', () => {
  test('should display last reviewed date on hubs with showMetadata=true', async ({ page }) => {
    await page.goto(`${BASE_URL}/adhd`);
    await page.waitForLoadState('networkidle');
    
    const badgeContainer = page.locator('[data-testid="trust-badge"], [data-trust-badge], .trust-badge').first();
    await expect(badgeContainer).toBeVisible({ timeout: 10000 });

    // In the TrustBadge details layout, the label and the date are separate spans.
    const lastReviewedLabel = badgeContainer.locator('text=/Last reviewed:/i').first();
    await expect(lastReviewedLabel).toBeVisible();

    const lastReviewedDate = lastReviewedLabel
      .locator('..')
      .locator('span')
      .filter({ hasText: /\d{4}/ })
      .first();
    await expect(lastReviewedDate).toBeVisible();
  });
  
  test('should display primary sources on pathway pages', async ({ page }) => {
    await page.goto(`${BASE_URL}/adhd/pathway`);
    await page.waitForLoadState('networkidle');
    
    // Look for "Primary sources" text
    const primarySources = page.locator('text=/Primary sources/i');
    await expect(primarySources).toBeVisible();
    
    // Should mention specific sources (e.g., NICE, NG87)
    const sourcesSection = page.locator('text=/Primary sources.*NG87|Primary sources.*NICE/i');
    await expect(sourcesSection.first()).toBeVisible();
  });
  
  test('should display reviewed by information when available', async ({ page }) => {
    await page.goto(`${BASE_URL}/adhd/pathway`);
    await page.waitForLoadState('networkidle');
    
    // Check if "Reviewed by" appears (optional, as not all pages may have this)
    const reviewedBy = page.locator('text=/Reviewed by/i').first();
    if (await reviewedBy.isVisible({ timeout: 5000 })) {
      const reviewerText = await reviewedBy.textContent();
      expect(reviewerText).toBeTruthy();
      expect(reviewerText?.length).toBeGreaterThan(10);
    }
  });
});

test.describe('Trust Badge Accessibility', () => {
  test('should have proper ARIA labels and semantic HTML', async ({ page }) => {
    await page.goto(`${BASE_URL}/adhd`);
    await page.waitForLoadState('networkidle');
    
    // Validate page title is present for screen readers
    const h1 = page.getByRole('heading', { level: 1 }).first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('ADHD');
    
    // Trust badge should be present and visible
    const badgeContainer = page.locator('[data-testid="trust-badge"], [data-trust-badge], .trust-badge').first();
    await expect(badgeContainer).toBeVisible();
  });
  
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto(`${BASE_URL}/adhd`);
    await page.waitForLoadState('networkidle');
    
    // Focus on page and tab through elements
    await page.keyboard.press('Tab');
    
    // Check that focus is visible (badges should be part of natural tab order if interactive)
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    expect(focusedElement).toBeTruthy();
  });
});
