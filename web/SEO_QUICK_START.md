# NeuroBreath SEO - Quick Start Guide

This guide helps you quickly verify and understand the SEO implementation.

## 🚀 Quick Verification (5 minutes)

### 1. Check Technical Endpoints

Open these URLs in your browser (after deployment to production):

```text
https://neurobreath.co.uk/sitemap.xml
https://neurobreath.co.uk/robots.txt
https://neurobreath.co.uk/manifest.json
```

**Expected Results:**

- ✅ sitemap.xml: XML file with 50+ `<url>` entries
- ✅ robots.txt: Text file with User-agent rules and Sitemap reference
- ✅ manifest.json: JSON file with app name, icons, theme_color

### 2. Run SEO Validation Script

```bash
cd /Users/akoroma/Documents/GitHub/neurobreath-platform/web
npx tsx scripts/validate-seo.ts
```

**Expected Output:**

- Summary statistics showing high percentage of pages with metadata
- List of any pages needing attention
- ✅ Exit code 0 if validation passes

### 3. Run E2E SEO Tests

```bash
npm run test:e2e tests/seo.spec.ts
```

**Expected Result:**

- All test suites pass
- Meta tags, structured data, and technical SEO validated

### 4. View Page Source (Any Page)

Right-click on homepage → "View Page Source"

**Look for:**

- `<title>` tag with "NeuroBreath"
- `<meta name="description">` with content
- `<link rel="canonical">` with full URL
- `<meta property="og:*">` OpenGraph tags
- `<script type="application/ld+json">` with Organization/WebSite schemas

---

## 📝 Adding SEO to a New Page

### For Static Pages (Server Components)

```typescript
// app/your-page/page.tsx
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/json-ld';
import { generateWebPageSchema } from '@/lib/seo/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'Your Page Title',
  description: 'Compelling description 150-170 characters with keywords naturally integrated for better SEO.',
  path: '/your-page',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
});

export default function YourPage() {
  const schema = generateWebPageSchema({
    url: 'https://neurobreath.co.uk/your-page',
    name: 'Your Page Title',
    description: 'Your page description',
  });

  return (
    <>
      <JsonLd data={schema} />
      <main>
        <h1>Your Page Title</h1>
        {/* Content */}
      </main>
    </>
  );
}
```

### For Client Components

Create a layout for metadata:

```typescript
// app/your-section/layout.tsx
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Your Section',
  description: 'Description here...',
  path: '/your-section',
});

export default function Layout({ children }) {
  return <>{children}</>;
}
```

---

## 🎯 SEO Checklist for New Pages

- [ ] Unique title (50-60 characters)
- [ ] Unique meta description (150-170 characters)
- [ ] Canonical URL configured
- [ ] Exactly one H1 on the page
- [ ] H2/H3 headings in logical order
- [ ] Images have alt text (content images) or alt="" (decorative)
- [ ] WebPage schema added
- [ ] BreadcrumbList schema added (if applicable)
- [ ] Route added to sitemap.ts
- [ ] Page listed in INDEXABLE_ROUTES (if public)
- [ ] Validation script passes

---

## 🔧 Common Tasks

### Update Site-Wide Settings

Edit `/lib/seo/site-seo.ts`:

- Site name, slogan, description
- Social media URLs
- Default OG image
- Organization contact info

### Add New Route to Sitemap

Edit `/app/sitemap.ts`:

```typescript
{
  url: `${baseUrl}/new-route`,
  lastModified: currentDate,
  changeFrequency: 'monthly',
  priority: 0.7,
},
```

### Block Route from Indexing

Edit `/app/robots.ts`:

```typescript
disallow: [
  '/api/',
  '/your-private-route/',
],
```

---

## 🐛 Troubleshooting

### "Page not showing in sitemap"

→ Check `/app/sitemap.ts` and add the route

### "Metadata not appearing"

→ For client components, create a `layout.tsx` in the same directory

### "Structured data errors in Google"

→ Test with <https://search.google.com/test/rich-results>
→ Check JSON-LD syntax in page source

### "Build failing with type errors"

→ Run `npx tsc --noEmit` to see TypeScript errors
→ Check imports from `/lib/seo/*` are correct

---

## 📊 Monitoring After Deployment

### Google Search Console (Priority)

1. **Submit Sitemap:**
   - Search Console → Sitemaps
   - Add: `https://neurobreath.co.uk/sitemap.xml`
   - Monitor for errors

2. **Check Index Coverage:**
   - Monitor "Valid" pages count
   - Investigate "Excluded" or "Error" pages

3. **Monitor Core Web Vitals:**
   - Ensure LCP < 2.5s
   - Ensure CLS < 0.1
   - Ensure INP < 200ms

### Testing Tools

- **Rich Results Test:** <https://search.google.com/test/rich-results>
- **Lighthouse:** Chrome DevTools → Lighthouse tab
- **PageSpeed Insights:** <https://pagespeed.web.dev/>
- **Mobile-Friendly Test:** <https://search.google.com/test/mobile-friendly>

---

## 📚 Documentation References

- **Implementation Report:** `SEO_IMPLEMENTATION_REPORT.md`
- **Site Config:** `/lib/seo/site-seo.ts`
- **Metadata Helpers:** `/lib/seo/metadata.ts`
- **Schema Helpers:** `/lib/seo/schema.ts`
- **Validation Script:** `/scripts/validate-seo.ts`
- **E2E Tests:** `/tests/seo.spec.ts`

---

## ⚡ Performance Tips

1. **Images:**
   - Use next/image for all content images
   - Add `priority` only to LCP image (hero)
   - Convert large images to WebP
   - Set explicit width/height

2. **Fonts:**
   - Already optimized with `display: 'swap'`
   - Inter font self-hosted via next/font

3. **Code Splitting:**
   - Already automatic with Next.js 15
   - Use dynamic imports for heavy components

---

## ✅ Definition of Done (Checklist)

All items below are **COMPLETE** ✅:

- [x] Unique title + description for every indexable page
- [x] Canonical URLs for every indexable page
- [x] Sitemap.xml with all routes
- [x] Robots.txt with proper rules
- [x] Web manifest with icons
- [x] Organization + WebSite structured data
- [x] WebPage + Breadcrumb schemas ready to use
- [x] One H1 per page (verified)
- [x] Favicon + app icons configured
- [x] Automated validation script
- [x] E2E Playwright tests
- [x] UK English (en-GB) set globally
- [x] Font optimization (display: swap)
- [x] Build succeeds with no errors

---

## 🎉 You're All Set

The SEO infrastructure is production-ready. Deploy, monitor, and iterate based on Search Console data.

**Questions?** Refer to `SEO_IMPLEMENTATION_REPORT.md` for comprehensive details.
