# SEO QA Testing Checklist

Use this checklist to systematically verify SEO implementation across the NeuroBreath platform.

**Date:** _____________  
**Tester:** _____________  
**Environment:** [ ] Local [ ] Staging [ ] Production  

---

## ✅ Post-Deployment Verification (Production)

Use this section after deploying to confirm (a) crawlers can discover + index NeuroBreath, (b) mobile usability isn’t blocking ranking, and (c) technical SEO signals are clean.

### 1) Confirm crawl entry points (must-pass)

- [ ] <https://neurobreath.co.uk/robots.txt> loads (200) and does not block important routes
- [ ] <https://neurobreath.co.uk/sitemap.xml> loads (200)
- [ ] If sitemap is an index: it references the locale sitemaps:
  - [ ] <https://neurobreath.co.uk/sitemap-uk.xml>
  - [ ] <https://neurobreath.co.uk/sitemap-us.xml>
- [ ] Sitemap URLs are canonical (no localhost / preview domains)
- [ ] Sample sitemap URLs return 200 when opened

Quick terminal checks:

```bash
curl -sSI https://neurobreath.co.uk/robots.txt | tr -d '\r' | egrep -i 'HTTP/|content-type'
curl -sS  https://neurobreath.co.uk/robots.txt | sed -n '1,120p'

curl -sSI https://neurobreath.co.uk/sitemap.xml | tr -d '\r' | egrep -i 'HTTP/|content-type'
curl -sS  https://neurobreath.co.uk/sitemap.xml | sed -n '1,40p'
```

### 2) Verify viewport + mobile rendering (Fold issues often start here)

- [ ] On Samsung Fold 5 (cover + unfolded): Chrome “Desktop site” is OFF
- [ ] Page does not look zoomed-out / tiny text
- [ ] No horizontal scroll on key pages

Technical confirmation (desktop DevTools):

- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1">` (or App Router `viewport` config) is present
- [ ] Handset breakpoints behave like phone under 768px, and 640–767px stays single-column

### 3) Verify canonical + indexing headers on key pages

Check these pages at minimum:

- [ ] Home: <https://neurobreath.co.uk/>
- [ ] UK home: <https://neurobreath.co.uk/uk>
- [ ] Conditions overview: <https://neurobreath.co.uk/uk/conditions>
- [ ] Autism hub: <https://neurobreath.co.uk/autism>
- [ ] ADHD hub: <https://neurobreath.co.uk/adhd>
- [ ] Dyslexia reading training: <https://neurobreath.co.uk/dyslexia-reading-training>
- [ ] Anxiety tools: <https://neurobreath.co.uk/tools/anxiety-tools>
- [ ] Stress tools: <https://neurobreath.co.uk/tools/stress-tools>
- [ ] Sleep: <https://neurobreath.co.uk/sleep>
- [ ] Depression guide: <https://neurobreath.co.uk/conditions/depression>

Pass criteria:

- [ ] HTTP 200
- [ ] No `x-robots-tag: noindex`
- [ ] Canonical points to the correct final URL (not staging)

Quick header checks:

```bash
curl -sSI https://neurobreath.co.uk/ | tr -d '\r' | egrep -i 'HTTP/|x-robots-tag|location|cache-control|content-type'
curl -sSI https://neurobreath.co.uk/uk/conditions | tr -d '\r' | egrep -i 'HTTP/|x-robots-tag|location|cache-control|content-type'
```

### 4) Google Search Console (recommended)

- [ ] Add property (domain property if you control DNS)
- [ ] Verify ownership
- [ ] Submit sitemap URL(s)
- [ ] URL Inspection → “Test live URL” → request indexing for top pages

### 5) Fix internal 404s (silent visibility killer)

Before deploy (local automated gate):

- [ ] Run `cd web && yarn links:verify` (writes `reports/links-verification.json`)

After deploy (spot-check in prod):

- [ ] Conditions overview pages do not surface links that 404
- [ ] Footer/nav links all return 200

### 6) Mobile usability checks (ranking + retention)

Test key pages at widths:

- [ ] 360–390px (small phones)
- [ ] 640–767px (large phones)
- [ ] 768px+ (tablet baseline)

Pass criteria:

- [ ] No horizontal scroll
- [ ] Text readable without zoom
- [ ] Tap targets not too small
- [ ] Single-column where required

### 7) Core Web Vitals validation

- [ ] Google PageSpeed Insights (mobile) on key pages
- [ ] Chrome Lighthouse (mobile profile)

Pass criteria:

- [ ] No severe LCP/INP/CLS regressions, especially on mobile
- [ ] Fonts don’t cause noticeable layout shifts

### 8) Structured data validation

- [ ] Run Google Rich Results Test: <https://search.google.com/test/rich-results>
- [ ] Organization + WebSite schema present
- [ ] Breadcrumb schema present on hubs/guides where expected

Pass criteria:

- [ ] No critical structured data errors
- [ ] Schema matches real content (no overclaims)

### 9) Titles + descriptions are unique and intent-focused

- [ ] Each major page has a distinct `<title>`
- [ ] Meta descriptions are unique (not boilerplate everywhere)
- [ ] One clear H1 aligned to page intent

### 10) Expand beyond Google (optional)

- [ ] Register with Bing Webmaster Tools
- [ ] Submit sitemap there as well

## 🌐 Technical Endpoints

### Sitemap.xml

- [ ] URL accessible: <https://neurobreath.co.uk/sitemap.xml>
- [ ] Valid XML format (no parsing errors)
- [ ] Contains 50+ `<url>` entries
- [ ] Homepage has priority="1.0"
- [ ] Main hubs have priority="0.9" (ADHD, Autism, Anxiety)
- [ ] All URLs use https://
- [ ] lastModified dates present
- [ ] changeFrequency values appropriate

### Robots.txt

- [ ] URL accessible: <https://neurobreath.co.uk/robots.txt>
- [ ] Contains `User-agent: *`
- [ ] Contains `Allow: /`
- [ ] Disallows `/api/`
- [ ] Disallows `/parent/`
- [ ] Disallows `/teacher/dashboard`
- [ ] References sitemap: `Sitemap: https://neurobreath.co.uk/sitemap.xml`

### Manifest.json

- [ ] URL accessible: <https://neurobreath.co.uk/manifest.json>
- [ ] Valid JSON (no syntax errors)
- [ ] Has `name` property: "NeuroBreath"
- [ ] Has `short_name` property
- [ ] Has `icons` array with multiple sizes
- [ ] Has `theme_color` set
- [ ] Has `background_color` set
- [ ] Has `display: "standalone"`

---

## 🏠 Homepage (/) Testing

### Meta Tags

- [ ] Title present: "NeuroBreath | Evidence-Based Neurodiversity Support"
- [ ] Title length: 50-70 characters ✓
- [ ] Meta description present
- [ ] Description length: 150-170 characters ✓
- [ ] Meta description compelling and actionable ✓
- [ ] Canonical URL: `https://neurobreath.co.uk/`
- [ ] Meta viewport present
- [ ] Lang attribute: `en-GB` on `<html>` tag

### Open Graph Tags

- [ ] `og:title` present and matches title
- [ ] `og:description` present and matches meta description
- [ ] `og:type` = "website"
- [ ] `og:url` = "<https://neurobreath.co.uk/>"
- [ ] `og:image` present and loads correctly
- [ ] `og:image` is 1200x630 pixels (optimal)
- [ ] `og:site_name` = "NeuroBreath"
- [ ] `og:locale` = "en_GB"

### Twitter Card Tags

- [ ] `twitter:card` = "summary_large_image"
- [ ] `twitter:site` present (@neurobreath or similar)
- [ ] `twitter:title` present
- [ ] `twitter:description` present
- [ ] `twitter:image` present

### Structured Data (JSON-LD)

- [ ] Organization schema present in page source
- [ ] WebSite schema present in page source
- [ ] JSON-LD is valid (no syntax errors)
- [ ] Organization schema has `name`, `url`, `logo`
- [ ] WebSite schema has SearchAction
- [ ] Test with Google Rich Results Test: <https://search.google.com/test/rich-results>

### Heading Structure

- [ ] Exactly one `<h1>` tag on page
- [ ] H1 text is clear and descriptive
- [ ] Multiple `<h2>` tags present for section headings
- [ ] No skipped heading levels (no H1 → H3 without H2)
- [ ] Heading hierarchy is logical

### Icons & Favicons

- [ ] Favicon loads in browser tab
- [ ] Apple touch icon present (check on mobile device)
- [ ] 192x192 icon present (PWA)
- [ ] 512x512 icon present (PWA)
- [ ] Maskable icons present (PWA) — 192x192 + 512x512 with `purpose: "maskable"`

---

## 📄 Condition Hubs Testing

### ADHD Hub (/adhd)

- [ ] Title: Contains "ADHD" and "NeuroBreath"
- [ ] Meta description: Unique and mentions target audiences (children, parents, teachers)
- [ ] Canonical: `https://neurobreath.co.uk/adhd`
- [ ] One H1 present
- [ ] WebPage schema present (check page source)
- [ ] OG image present and loads

### Autism Hub (/autism)

- [ ] Title: Contains "Autism" and "NeuroBreath"
- [ ] Meta description: Unique and mentions visual supports, strategies
- [ ] Canonical: `https://neurobreath.co.uk/autism`
- [ ] One H1 present
- [ ] WebPage schema present
- [ ] OG image present and loads

### Anxiety Hub (/anxiety)

- [ ] Title: Contains "Anxiety" and "NeuroBreath"
- [ ] Meta description: Mentions CBT, breathing exercises, tools
- [ ] Canonical: `https://neurobreath.co.uk/anxiety`
- [ ] One H1 present
- [ ] WebPage + Breadcrumb schemas present
- [ ] OG image present and loads

---

## 🔧 Tools & Resources Testing

### Tools Hub (/tools)

- [ ] Title: Contains "Tools" and "NeuroBreath"
- [ ] Meta description: Mentions interactive tools, ADHD, autism, anxiety
- [ ] Canonical present
- [ ] One H1
- [ ] Schema present

### Coach Page (/coach)

- [ ] Title: Contains "AI" or "Coach" and "NeuroBreath"
- [ ] Meta description: Mentions AI-powered, personalised support
- [ ] Canonical present
- [ ] One H1
- [ ] Schema present

### Breathing Hub (/breathing)

- [ ] Title: Contains "Breathing" and "NeuroBreath"
- [ ] Meta description: Mentions specific techniques (4-7-8, box, coherent)
- [ ] Canonical present
- [ ] One H1
- [ ] Schema present

---

## 💨 Breathing Techniques Testing

### 4-7-8 Technique (/techniques/4-7-8)

- [ ] Title: "4-7-8 Breathing Technique | NeuroBreath"
- [ ] Meta description: Describes technique and benefits
- [ ] Canonical present
- [ ] One H1
- [ ] Duration mentioned in description

### Box Breathing (/techniques/box-breathing)

- [ ] Title: "Box Breathing Technique | NeuroBreath"
- [ ] Meta description: Mentions Navy SEALs, focus, stress management
- [ ] Canonical present
- [ ] One H1

### Coherent Breathing (/techniques/coherent)

- [ ] Title: "Coherent Breathing Technique | NeuroBreath"
- [ ] Meta description: Mentions HRV, nervous system balance
- [ ] Canonical present
- [ ] One H1

### SOS Technique (/techniques/sos)

- [ ] Title: "60-Second SOS Breathing Technique | NeuroBreath"
- [ ] Meta description: Mentions emergency calm, 60 seconds, rapid relief
- [ ] Canonical present
- [ ] One H1

---

## 🎓 Audience-Specific Pages Testing

### ADHD Parent Hub (/conditions/adhd-parent)

- [ ] Title: Contains "ADHD", "Parent" and "NeuroBreath"
- [ ] Meta description: Tailored for parents
- [ ] Canonical present
- [ ] One H1
- [ ] Keywords appropriate for parent audience

### ADHD Teacher Hub (/conditions/adhd-teacher)

- [ ] Title: Contains "ADHD", "Teacher" and "NeuroBreath"
- [ ] Meta description: Tailored for teachers
- [ ] Canonical present
- [ ] One H1
- [ ] Keywords include "classroom", "SEND"

### Autism Parent Hub (/conditions/autism-parent)

- [ ] Title: Contains "Autism", "Parent" and "NeuroBreath"
- [ ] Meta description: Mentions visual supports, strategies
- [ ] Canonical present
- [ ] One H1

### Autism Teacher Hub (/conditions/autism-teacher)

- [ ] Title: Contains "Autism", "Teacher" and "NeuroBreath"
- [ ] Meta description: Classroom-focused
- [ ] Canonical present
- [ ] One H1

---

## 📱 Mobile & Accessibility Testing

### Mobile Responsiveness

- [ ] All pages load correctly on mobile (test on real device or emulator)
- [ ] Text is readable without zooming
- [ ] Buttons and links are tappable (not too small)
- [ ] No horizontal scrolling
- [ ] Images scale appropriately

### Accessibility

- [ ] Skip to main content link present (test with Tab key)
- [ ] Images have alt text (right-click → Inspect)
- [ ] Decorative images have alt="" and aria-hidden="true"
- [ ] Forms have proper labels
- [ ] Color contrast is sufficient (run Lighthouse audit)
- [ ] Keyboard navigation works (test with Tab/Shift+Tab)

---

## ⚡ Performance Testing

### Load Time (Homepage)

- [ ] Page loads in under 3 seconds (4G connection)
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Interaction to Next Paint < 200ms

### Lighthouse Audit (Homepage)

- [ ] Performance score: Green (90+) or Yellow (50-89)
- [ ] Accessibility score: Green (90+)
- [ ] Best Practices score: Green (90+)
- [ ] SEO score: Green (90+)

**Run Lighthouse:** Chrome DevTools → Lighthouse tab → Generate report

---

## 🔍 Search Console Verification (Post-Deployment)

### Setup

- [ ] Domain verified in Google Search Console
- [ ] Sitemap submitted: `https://neurobreath.co.uk/sitemap.xml`
- [ ] No sitemap errors reported
- [ ] Bing Webmaster Tools configured (optional but recommended)

### Monitoring (Check 1 week after deployment)

- [ ] Index Coverage: No errors
- [ ] Valid pages count increasing
- [ ] Core Web Vitals: All green or yellow
- [ ] Mobile Usability: No issues
- [ ] Enhancements (Structured Data): No critical errors

---

## 🧪 Automated Testing

### SEO Validation Script

```bash
npx tsx scripts/validate-seo.ts
```

- [ ] Script runs without errors
- [ ] All critical pages pass validation
- [ ] No missing metadata warnings

### Playwright E2E Tests

```bash
npm run test:e2e tests/seo.spec.ts
```

- [ ] All test suites pass
- [ ] Meta tags tests pass
- [ ] Heading structure tests pass
- [ ] Structured data tests pass
- [ ] Accessibility tests pass
- [ ] Technical SEO tests pass (sitemap, robots, manifest)

---

## 🚫 Negative Testing (What Should NOT Be Indexed)

### API Routes

- [ ] <https://neurobreath.co.uk/api/ai-coach> → Check robots.txt blocks this
- [ ] Other /api/* routes blocked

### Private Dashboards

- [ ] /teacher/dashboard → Should have `robots: noindex, nofollow` in metadata
- [ ] /parent/[code] → Should have noindex
- [ ] /progress → Should have noindex

### Test in robots.txt

```text
Disallow: /api/
Disallow: /parent/
Disallow: /teacher/dashboard
```

---

## 📋 Final Verification Checklist

Before marking as complete, verify:

- [ ] All sections of this checklist completed
- [ ] No critical issues found
- [ ] All automated tests passing
- [ ] Lighthouse scores acceptable (80+ for SEO)
- [ ] Google Rich Results Test passes for homepage
- [ ] Sitemap submitted to Search Console (post-deployment)
- [ ] Core Web Vitals monitored (post-deployment)

---

## 📝 Issues Found (Document Below)

| Page/URL | Issue Description | Severity | Status | Notes |
| -------- | ----------------- | -------- | ------ | ----- |
|          |                   |          |        |       |
|          |                   |          |        |       |
|          |                   |          |        |       |

**Severity Levels:**

- **Critical:** Blocks indexing, broken functionality
- **High:** Missing essential SEO elements
- **Medium:** Quality issues, optimization opportunities
- **Low:** Minor improvements

---

## ✅ Sign-Off

**Tester Name:** ___________________________

**Date:** ___________________________

**Overall Status:** [ ] PASS [ ] PASS WITH MINOR ISSUES [ ] FAIL

**Notes:**

---

---

---

---

**Next Steps:**

1. If PASS: Deploy to production and monitor
2. If PASS WITH MINOR ISSUES: Document issues and create tasks
3. If FAIL: Address critical issues and re-test

**Deployment Approval:** [ ] YES [ ] NO

**Approved By:** ___________________________

**Date:** ___________________________
