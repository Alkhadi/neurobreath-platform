# NeuroBreath JavaScript Modules

This directory contains all JavaScript modules for the NeuroBreath website.

## Core Modules

### `site.js`
- **Purpose:** Core site functionality, stats tracking, navigation, theme management
- **Features:** 
  - Stats module for tracking breathing sessions
  - Navigation handling
  - Theme editor functionality
  - Back-to-top button
  - Smooth scrolling
- **Usage:** Include on all pages: `<script src="assets/js/site.js" defer></script>`

### `voice-preferences.js`
- **Purpose:** Voice preferences and speech synthesis support
- **Features:**
  - Voice preference storage
  - Speech synthesis setup
  - Text-to-speech functionality
- **Usage:** Include on pages with narration: `<script src="assets/js/voice-preferences.js" defer></script>`

### `page-narration.js`
- **Purpose:** Page narration functionality
- **Usage:** Include on pages that need narration features

### `pdf-links.js`
- **Purpose:** PDF link handling and tracking
- **Usage:** Include on pages with PDF downloads

### `quick-start-modal.js`
- **Purpose:** Quick start modal functionality
- **Usage:** Include on pages with quick start features

## ADHD Modules

### `adhd-assessment.js`
- **Purpose:** ADHD assessment tools and forms
- **Usage:** Include on ADHD assessment pages

### `adhd-diagnosis.js`
- **Purpose:** ADHD diagnosis support tools
- **Usage:** Include on ADHD diagnosis pages

### `adhd-focus-lab.js`
- **Purpose:** ADHD focus lab functionality
- **Usage:** Include on ADHD focus lab pages

### `adhd-games.js`
- **Purpose:** ADHD games suite functionality
- **Usage:** Include on ADHD games pages (requires `adhd-games.css`)

### `adhd-guide.js`
- **Purpose:** ADHD guide page functionality
- **Usage:** Include on ADHD guide pages (requires `adhd-guide.css`)

### `adhd-school.js`
- **Purpose:** ADHD school support tools
- **Usage:** Include on ADHD school support pages

### `adhd-self-care.js`
- **Purpose:** ADHD self-care tools and planners
- **Usage:** Include on ADHD self-care pages

### `adhd-support-home.js`
- **Purpose:** ADHD home support functionality
- **Usage:** Include on ADHD home support pages

### `adhd-teens.js`
- **Purpose:** ADHD teen-specific tools
- **Usage:** Include on ADHD teen pages

### `adhd-tools.js`
- **Purpose:** ADHD tools page functionality
- **Usage:** Include on ADHD tools pages

### `adhd-what-is.js`
- **Purpose:** ADHD "What is" page functionality
- **Usage:** Include on ADHD informational pages

### `adhd-young-people.js`
- **Purpose:** ADHD young adult tools
- **Usage:** Include on ADHD young adult pages

## Autism Modules

### `autism.js`
- **Purpose:** General autism page functionality
- **Usage:** Include on autism pages

### `autism-teacher.js`
- **Purpose:** Autism teacher page specific functionality
- **Features:**
  - Focus ring on tab navigation
  - External link marking
- **Usage:** Include on autism teacher pages: `<script src="assets/js/autism-teacher.js" defer></script>`

## Dyslexia Modules

### `dyslexia-progress.js`
- **Purpose:** Dyslexia progress tracking
- **Usage:** Include on dyslexia progress pages

### `dlx-analytics-stage3.js`
- **Purpose:** Dyslexia analytics for stage 3
- **Usage:** Include on dyslexia analytics pages

### `dlx-audio-tts-bridge.js`
- **Purpose:** Audio and text-to-speech bridge for dyslexia tools
- **Usage:** Include on dyslexia audio pages

### `dlx-phonics-curriculum-phase-2-3-5.js`
- **Purpose:** Phonics curriculum for phases 2, 3, and 5
- **Usage:** Include on phonics curriculum pages

### `dlx-stage3-content.js`
- **Purpose:** Stage 3 content management
- **Usage:** Include on dyslexia stage 3 pages

### `phonics-sounds-lab.js`
- **Purpose:** Phonics sounds lab functionality
- **Usage:** Include on phonics sounds lab pages (requires `phonics-sounds-lab.css`)

## Breathing & Techniques

### `breathing-session.js`
- **Purpose:** Breathing session tracking and management
- **Usage:** Include on breathing technique pages

### `tech-478.js`
- **Purpose:** 4-7-8 breathing technique functionality
- **Usage:** Include on 4-7-8 breathing pages

## Home & Progress

### `home.js`
- **Purpose:** Home page functionality
- **Usage:** Include on home page

### `home-challenge-lab.js`
- **Purpose:** Home challenge lab functionality
- **Usage:** Include on home challenge pages

### `home-progress-extras.js`
- **Purpose:** Home progress tracking extras
- **Usage:** Include on home progress pages

## React App

### `app.js`
- **Purpose:** React-based Focus Garden application
- **Usage:** Used by `index.html` with React CDN
- **Note:** This is a React SPA, separate from other pages

## Integration Guidelines

1. **Always include `site.js`** on traditional HTML pages for core functionality
2. **Include page-specific modules** based on the page content
3. **Use `defer` attribute** for all script tags to ensure proper loading order
4. **Check CSS dependencies** - some JS modules require corresponding CSS files
5. **Module dependencies:**
   - `voice-preferences.js` is often needed by modules that use TTS
   - `site.js` provides base functionality used by other modules

## Example Usage

```html
<!-- Basic page -->
<script src="assets/js/site.js" defer></script>

<!-- ADHD page with games -->
<script src="assets/js/site.js" defer></script>
<script src="assets/js/adhd-games.js" defer></script>

<!-- Autism teacher page -->
<script src="assets/js/site.js" defer></script>
<script src="assets/js/voice-preferences.js" defer></script>
<script src="assets/js/autism-teacher.js" defer></script>

<!-- Breathing technique page -->
<script src="assets/js/site.js" defer></script>
<script src="assets/js/breathing-session.js" defer></script>
<script src="assets/js/tech-478.js" defer></script>
```

## File Organization

- Core modules: `site.js`, `voice-preferences.js`, `page-narration.js`, `pdf-links.js`
- Condition-specific: `adhd-*.js`, `autism*.js`, `dyslexia*.js`, `dlx-*.js`
- Feature-specific: `breathing-session.js`, `tech-478.js`, `phonics-sounds-lab.js`
- Home modules: `home*.js`
- React app: `app.js` (separate SPA)

