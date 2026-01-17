# Search Console Readiness

## Executive checklist

- Submit sitemap index: <https://neurobreath.co.uk/sitemap.xml>
- Verify canonical + hreflang on UK/US pages
- Confirm robots.txt references sitemap index
- Monitor coverage weekly after release
- Review CWV monthly (LCP < 2.5s, INP < 200ms, CLS < 0.1)

## Submission steps

1. Add site property in Google Search Console.
2. Verify ownership (DNS preferred).
3. Submit sitemap index: `/sitemap.xml`.
4. Use URL inspection on: `/uk`, `/us`, `/uk/trust`, `/us/trust`, `/uk/guides`, `/us/guides`.

## Monitoring cadence

- Weekly: Index coverage, errors, excluded URLs.
- Monthly: Core Web Vitals report review.
- Quarterly: Evidence review cadence for trust pages and key guides.

## Index coverage expectations

- Indexable: pillars, guides, trust pages, and approved tool hubs.
- Conditional: tool pages must include sufficient explanatory content.
- Noindex: onboarding utilities, dashboards, auth and API routes.

## CWV monitoring plan

- Lighthouse CI against key pages.
- Track before/after scores in `reports/search-console/perf-cwv.md`.
- Remediate regressions with image/JS and layout fixes.

## Known limitations

- Sitemap index is generated dynamically; ensure runtime server access in CI.
- Dynamic routes require fixtures; missing fixtures are excluded and flagged by validators.
- Any new tool page must be reviewed against the indexing policy allowlist.

## Next steps

- Expand structured data QA page in dev mode.
- Add automated prefetch for critical content images.
- Consider x-default hreflang if expansion beyond UK/US.
