# Bipolar Page Integration Guide

## 📦 What You're Getting

A complete, production-ready NextJS page about Bipolar Disorder with:

- **23 files** across 7 directories
- **360 KB** total size (including 112 KB research data)
- **12 React components** (all functional, TypeScript)
- **5 fully functional interactive tools** with localStorage persistence
- **8 audience-specific support sections**
- **Comprehensive content** based on NHS, NICE, APA, WHO, CDC research
- **UK/US English language support** with automatic detection + manual toggle
- **Responsive design** optimized for mobile, tablet, and desktop
- **WCAG 2.1 AA accessible**

---

## 🚀 Quick Start

### Step 1: Copy Files to Your Project

Copy the entire `bipolar_page` folder to your NextJS project:

```bash
# From your local machine
cd ~/Documents/GitHub/neurobreath-platform/web

# Copy the files from the location where you've downloaded them
cp -r /path/to/downloaded/bipolar_page ./app/conditions/bipolar
```

### Step 2: Verify File Structure

Your project should now have:

```
your-nextjs-project/
└── app/
    └── conditions/
        └── bipolar/
            ├── page.tsx                    ✓ Main page
            ├── layout.tsx                  ✓ Metadata & layout
            ├── components/                 ✓ 12 components
            ├── utils/                      ✓ Utilities
            ├── types/                      ✓ TypeScript types
            ├── data/                       ✓ Research data
            ├── styles/                     ✓ CSS files
            └── README.md                   ✓ Documentation
```

### Step 3: Install Dependencies (if needed)

The page uses standard NextJS and React features. Ensure you have:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0"
  }
}
```

If you need to install:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 4: Access the Page

Start your development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Navigate to: **`http://localhost:3000/conditions/bipolar`**

---

## 🎨 Customization

### Colors

Edit `styles/globals.css` CSS variables:

```css
:root {
  --color-primary: #2563eb;        /* Main brand color */
  --color-secondary: #7c3aed;      /* Secondary color */
  --color-accent: #06b6d4;         /* Accent color */
  /* ... more colors ... */
}
```

### Language Defaults

Edit `utils/language.ts`:

```typescript
export const detectLanguage = (): Language => {
  // Modify detection logic here
  return 'en-GB'; // Change default
};
```

### Content

Edit content in:
- `components/ContentSections.tsx` - Main educational content
- `components/SupportResources.tsx` - Support resources for different audiences
- `data/research.json` - Source research data

---

## 🎯 Key Features Explained

### 1. **Mood Tracker**
- Daily mood logging (1-10 scale + mood state)
- Sleep hours tracking
- Medication adherence tracking
- Notes and triggers
- Calendar view of past entries
- CSV/JSON export functionality
- Data persisted in localStorage

**Usage:**
```typescript
<MoodTracker language={language} />
```

### 2. **Streak System**
- Tracks consecutive days of mood logging
- Displays current streak and longest streak
- Progress bar to next milestone
- Milestone rewards (3, 7, 14, 30, 60, 90 days)
- Visual indicators and icons

**Usage:**
```typescript
<StreakCounter language={language} />
```

### 3. **Achievements**
- 10 unlockable achievements
- Progress tracking
- Celebration animations
- Achievement gallery
- Automatically unlocks based on user actions

**Usage:**
```typescript
<Achievements language={language} />
```

### 4. **Progress Tracker**
- Mood trends over time (week/month/year views)
- Statistics: average mood, sleep, medication adherence
- Bar chart visualization
- Mood states distribution
- Personalized insights and recommendations

**Usage:**
```typescript
<ProgressTracker language={language} />
```

### 5. **Interactive Management Tools**

Three evidence-based exercises:

a. **4-7-8 Breathing Exercise**
   - Animated breathing guide
   - Cycle counter
   - Instructions and evidence base

b. **5-4-3-2-1 Grounding Technique**
   - Step-by-step guided exercise
   - Input fields for each sense
   - Progress indicators

c. **Cognitive Restructuring (Thought Challenge)**
   - Identify negative thoughts
   - Select cognitive distortions
   - Challenge with evidence
   - Reframe to balanced thoughts

**Usage:**
```typescript
<InteractiveTools language={language} />
```

---

## 📱 Responsive Breakpoints

The page is optimized for:

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

All components are mobile-first and fully responsive.

---

## ♿ Accessibility Features

- ✅ Semantic HTML5 elements
- ✅ Proper heading hierarchy (h1 → h6)
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Color contrast (WCAG AA)
- ✅ Screen reader friendly
- ✅ Alt text for icons (emoji with aria-label)

---

## 🗄️ Data Storage

### localStorage Keys

- `bipolar_page_data` - All user data (mood entries, streaks, achievements)
- `bipolar_language_preference` - Language preference

### Data Structure

```typescript
interface LocalStorageData {
  moodEntries: MoodEntry[];
  streak: Streak;
  achievements: Achievement[];
  languagePreference: LanguagePreference;
  interactiveTools: InteractiveToolData[];
}
```

### Privacy

- **No server communication** - All data stays in browser
- **No analytics or tracking**
- **No cookies**
- **User can export or delete data at any time**

---

## 🌍 Language Support

### Automatic Detection

On first visit, the page detects the user's browser language:
- `en-US`, `en-CA` → US English
- `en-GB`, `en-AU`, `en-NZ`, `en-IE` → UK English

### Manual Toggle

Fixed position button (top-right) allows manual switching:
- 🇬🇧 UK English
- 🇺🇸 US English

### Spelling Differences

The system correctly applies:
- UK: stabiliser, organisation, recognise, behaviour, colour, centre, counselling
- US: stabilizer, organization, recognize, behavior, color, center, counseling

---

## 📊 Content Sections

### Overview
Introduction to bipolar disorder, symptoms, and general information.

### Types
- Bipolar I Disorder
- Bipolar II Disorder
- Cyclothymic Disorder
- Other Specified Bipolar Disorders

### Diagnosis
- Diagnostic criteria (DSM-5 & ICD-11)
- Assessment tools
- Differential diagnosis

### Treatment
- Pharmacological treatment (mood stabilizers, antipsychotics)
- Psychological therapies (CBT, FFT, IPSRT)
- Lifestyle interventions
- Emergency/crisis intervention

### Management
- Mood monitoring
- Sleep hygiene
- Identifying triggers
- Building support networks
- Relapse prevention

### Support Resources (by audience)
- Children (age-appropriate resources)
- Adolescents (teen-specific support)
- Adults (work, relationships, organizations)
- Elderly (age-related considerations)
- Parents & Family (supporting a loved one)
- Teachers (classroom strategies)
- Carers (caregiving support)
- Healthcare Professionals (clinical guidelines)

### Statistics
- Global prevalence
- Age of onset
- Treatment effectiveness
- Key facts

---

## 🔧 Troubleshooting

### Issue: Components not rendering

**Solution:** Ensure all files are in the correct directory structure. Check for missing imports.

### Issue: localStorage not persisting

**Solution:** Check browser settings - localStorage must be enabled. Private/incognito mode may prevent persistence.

### Issue: Styling issues

**Solution:** Ensure `styles/globals.css` is imported in `page.tsx`. Check for CSS conflicts with parent application.

### Issue: TypeScript errors

**Solution:** Ensure TypeScript is installed. Run `npm install -D typescript @types/react @types/node`.

### Issue: Hydration errors

**Solution:** The page uses `mounted` state to prevent hydration mismatches. Ensure `'use client'` directive is present in client components.

---

## 🚢 Deployment

The page is ready for production deployment. No special configuration needed.

### Build

```bash
npm run build
```

### Environment Variables

None required - the page has no external dependencies or API calls.

### Performance

- Code splitting via Next.js
- Lazy loading of data
- Optimized CSS
- No external scripts
- Total bundle size: ~360 KB (including research data)

---

## 📚 Technical Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules + Global CSS
- **State Management:** React Hooks + localStorage
- **Data:** Static JSON (111 KB research data)

---

## 🤝 Integration with Existing Project

### If you have an existing header/footer:

The page is designed to work within your existing layout. It does NOT include its own header or footer.

### If you have a design system:

You can replace the CSS variables in `styles/globals.css` to match your brand colors and typography.

### If you want to modify content:

All content is in React components. Edit:
- `components/ContentSections.tsx` - Main content
- `components/SupportResources.tsx` - Support sections
- `data/research.json` - Source data

---

## 📈 Analytics & Tracking

The page includes **no analytics or tracking** by default. To add:

1. Add your analytics script to `layout.tsx`
2. Track user interactions using custom events
3. Respect user privacy and data protection regulations

---

## 🔐 Security Considerations

- ✅ No user authentication required
- ✅ No server-side data processing
- ✅ No external API calls
- ✅ No sensitive data collection
- ✅ Client-side data only (localStorage)
- ✅ No CORS issues
- ✅ No XSS vulnerabilities (React handles escaping)

---

## 📖 Content Attribution

The page includes evidence-based content from:
- NHS (National Health Service, UK)
- NICE (National Institute for Health and Care Excellence)
- American Psychiatric Association (DSM-5)
- WHO (World Health Organization)
- CDC (Centers for Disease Control and Prevention)
- PubMed Database
- Patient advocacy organizations (Bipolar UK, DBSA, NAMI)

All sources are cited in the References section.

---

## 🆘 Support & Questions

For technical issues or questions about the page:

1. Check this integration guide
2. Review the README.md
3. Inspect browser console for errors
4. Check Next.js documentation for App Router

---

## ✅ Launch Checklist

Before going live, verify:

- [ ] Page loads correctly at `/conditions/bipolar`
- [ ] All interactive tools work (Mood Tracker, Streaks, Achievements)
- [ ] Language toggle functions properly
- [ ] Mobile responsive design looks good
- [ ] All links work (internal anchors)
- [ ] localStorage persistence works
- [ ] Export functionality (CSV/JSON) works
- [ ] Accessibility tested (keyboard navigation, screen reader)
- [ ] Content reviewed for accuracy
- [ ] Styling matches your brand (if customized)
- [ ] Browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Performance tested (Lighthouse score)

---

## 🎉 You're All Set!

The Bipolar page is now ready to use. It provides comprehensive, evidence-based information with interactive tools to help users manage their condition.

**Page URL:** `http://your-domain.com/conditions/bipolar`

**Local Development:** `http://localhost:3000/conditions/bipolar`

---

**Questions or need help?** Refer to the README.md or review the component source code.

**Last Updated:** January 2026
