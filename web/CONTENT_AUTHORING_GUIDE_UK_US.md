# Content Authoring Guide (UK/US)

This guide explains how to add new canonical content and produce UK/US variants from a single source file.

## 1) Create a canonical page file

- Add a new file in `web/lib/content/pages/`.
- Export a `ContentPage` object.
- Define **base** copy first, then add UK/US overrides where needed.

Example (minimal skeleton):

- `id`: unique identifier
- `slugs`: `{ UK: 'my-page', US: 'my-page' }`
- `seo.title` + `seo.description`
- `h1`
- `blocks` (paragraphs, bullets, steps, etc.)
- `faqs` (optional)
- `citationsByRegion` with UK and US arrays
- `reviewedAt` and `reviewIntervalDays`

## 2) Add UK/US overrides

Use the `LocalisedString` shape:

```ts
{ base: 'Example', UK: 'Example (UK)', US: 'Example (US)' }
```

Only override when the wording should change. Keep structure aligned between UK and US.

## 3) Term tokens (safe localisation)

If a term needs localised wording, use tokens:

- `{term:primary_care}` becomes:
  - UK: “GP”
  - US: “primary care doctor”

Do **not** do global search/replace in copy. Tokens keep replacements controlled.

## 4) Citations by region

Use `citationsByRegion`:

- UK: NHS, NICE, GOV.UK, or UK‑specific guidance
- US: CDC, NIH, MedlinePlus, NIMH
- GLOBAL: peer‑reviewed or general references

Citations are rendered as text with “Copy link” buttons (no forced navigation).

## 5) FAQs and schema

- Add FAQs if helpful.
- Schema is only rendered when FAQs are visible.

## 6) Review cadence

Always include:

- `reviewedAt` (ISO date)
- `reviewIntervalDays`

Use 90–180 days depending on page sensitivity.

## 7) Register the page

Add the export to `web/lib/content/pages/index.ts` so it appears in `/uk/guides` and `/us/guides`.

## Editor checklist (tone & safety)

- UK English for /uk and US English for /us
- Educational language only
- Avoid medical claims or “treat/cure” wording
- Include evidence citations
- Use calm, professional tone
- Provide safe next steps (tools, routines)
