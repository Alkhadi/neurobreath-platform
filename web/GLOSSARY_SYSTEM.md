# Glossary & Plain‑English System

## Overview

A canonical glossary data source with plain‑English definitions, UK/US variants, and trust citations. Includes a glossary hub, term pages, and tooltip support.

## Routes

- /uk/glossary
- /us/glossary
- /uk/glossary/[term]
- /us/glossary/[term]

## Data Model

Defined in `/web/lib/glossary/glossary.ts`.

## Tooltips

- Only enabled for opted‑in pages
- Avoids headings, navigation, buttons, and code blocks
- Max 5 tooltips per page render

## Plain English Toggle

- Guides can include authored `plainEnglish` summaries
- Toggle displayed on regional guide pages when present

## Validation

Run `npm run glossary:validate` to generate:

- `/web/reports/glossary-validation.json`
- `/web/reports/glossary-validation.md`
