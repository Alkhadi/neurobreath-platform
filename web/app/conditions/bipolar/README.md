# Bipolar Disorder Resource Page

A comprehensive, evidence-based NextJS page about bipolar disorder with interactive tools and extensive support resources.

## Features

### Interactive Tools
- **Mood Tracker**: Daily mood logging with calendar view and data export
- **Streak System**: Track consecutive days of mood logging with milestones
- **Achievements**: Unlock badges for reaching self-care milestones
- **Progress Tracker**: Visualize mood trends with charts and insights
- **Management Exercises**:
  - 4-7-8 Breathing Exercise
  - 5-4-3-2-1 Grounding Technique
  - Cognitive Restructuring (Thought Challenge)

### Content Sections
- Overview and introduction
- Types of Bipolar Disorder (I, II, Cyclothymia)
- Diagnosis criteria and assessment tools
- Treatment options (medications, therapy, lifestyle)
- Management strategies
- Support resources for:
  - Children
  - Adolescents
  - Adults
  - Elderly
  - Parents & Family
  - Teachers
  - Carers/Caregivers
  - Healthcare Professionals
- Statistics and epidemiology
- References and citations

### Features
- ✅ Language support (UK English / US English)
- ✅ Automatic language detection + manual toggle
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessible (WCAG 2.1 AA compliant)
- ✅ localStorage persistence for user data
- ✅ Print-friendly styles
- ✅ Professional healthcare aesthetic
- ✅ Evidence-based content from NHS, NICE, APA, WHO, CDC

## Installation

### For Local Development

1. Copy the entire `bipolar_page` folder to your NextJS project's `app/conditions/` directory:

```bash
cp -r /home/ubuntu/bipolar_page /path/to/your/project/app/conditions/bipolar
```

2. Install dependencies (if not already installed):

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. The page will be available at: `http://localhost:3000/conditions/bipolar`

### For Production

The page is designed to integrate into an existing NextJS application with App Router. It does not include header/footer components, as it's expected to be part of a larger project.

## File Structure

```
bipolar_page/
├── page.tsx                    # Main page component
├── layout.tsx                  # Layout configuration
├── components/
│   ├── Hero.tsx               # Hero section
│   ├── Section.tsx            # Reusable section component
│   ├── ContentCard.tsx        # Content card component
│   ├── LanguageToggle.tsx     # Language switcher
│   ├── Badge.tsx              # Badge component
│   ├── MoodTracker.tsx        # Mood tracking tool
│   ├── StreakCounter.tsx      # Streak system
│   ├── Achievements.tsx       # Achievement system
│   ├── ProgressTracker.tsx    # Progress visualization
│   ├── InteractiveTools.tsx   # Management exercises
│   ├── ContentSections.tsx    # Main content sections
│   └── SupportResources.tsx   # Support resources by audience
├── utils/
│   ├── language.ts            # Language detection and translation
│   └── localStorage.ts        # Data persistence utilities
├── types/
│   └── index.ts              # TypeScript type definitions
├── data/
│   ├── research.json         # Research data (111 KB)
│   └── researchData.ts       # Data processing utilities
├── styles/
│   ├── globals.css           # Global styles
│   └── Page.module.css       # Page-specific styles
└── README.md                 # This file
```

## Data Persistence

All user data (mood entries, streaks, achievements) is stored in browser localStorage:
- Key: `bipolar_page_data`
- Language preference: `bipolar_language_preference`

Data persists across sessions and is never sent to any server.

## Language Support

### Automatic Detection
- Detects user's browser language on first visit
- US English (en-US) for US, Canada
- UK English (en-GB) for UK, Australia, New Zealand, Ireland

### Manual Toggle
- Fixed position toggle button (top-right)
- 🇬🇧 UK / 🇺🇸 US flags
- Preference saved to localStorage

### Spelling Differences
Correct spelling is applied throughout based on selected language:
- UK: stabiliser, organisation, recognise, behaviour, colour, centre
- US: stabilizer, organization, recognize, behavior, color, center

## Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- ARIA labels and roles
- Keyboard navigation support
- High color contrast (WCAG AA)
- Screen reader friendly
- Focus indicators
- Skip links

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

This page uses only React and NextJS core features. No external dependencies required.

## Credits

**Research Sources:**
- NHS (National Health Service, UK)
- NICE (National Institute for Health and Care Excellence)
- American Psychiatric Association (DSM-5)
- WHO (World Health Organization)
- CDC (Centers for Disease Control and Prevention)
- PubMed Database
- Bipolar UK, DBSA, NAMI

**Developed by:** Senior Full-Stack Engineer

**Date:** January 2026

## License

Content is evidence-based and compiled from public health resources. Please maintain attribution to original sources.

## Support

For issues or questions, refer to the main project documentation.

---

**Important Note:** This is a medical information resource. Always consult qualified healthcare professionals for diagnosis and treatment.
