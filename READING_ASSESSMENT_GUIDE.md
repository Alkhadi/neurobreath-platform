# Dyslexia Reading Assessment Module - Implementation Guide

## Overview

This document describes the comprehensive Dyslexia Reading Assessment module added to the NeuroBreath platform. The module provides training and monitoring tools for reading development, built on evidence-based structured literacy principles.

**IMPORTANT: Training/Monitoring Only**
This assessment module is for **training and monitoring purposes only**. It is NOT a medical diagnosis tool. For formal diagnosis of dyslexia or reading disorders, users must consult with a qualified reading specialist, educational psychologist, or physician.

## What's Implemented

### 1. Enhanced ReadingAssessment Component

**File:** `/web/components/ReadingAssessment.tsx`

#### Features

- **Interactive Assessment Modal:** Full-screen immersive interface with dark theme
- **15 Quick Assessment Questions** across 4 sections:
  - Letter Recognition (3 questions)
  - Phonics Skills (4 questions)
  - Sight Words (4 questions)
  - Comprehension (4 questions)
- **Real-time Feedback:** Immediate visual feedback (green/red) with explanations
- **Progress Tracking:** Visual progress bar showing overall completion percentage
- **Reading Level Calculation:** Automatic determination of reading band based on accuracy
  - **Beginner** (< 80% accuracy)
  - **Elementary** (80-89% accuracy)
  - **Intermediate** (90-95% accuracy)
  - **Advanced** (96%+ accuracy)

#### Results Screen Includes

- Overall score and accuracy percentage
- Reading level band with description
- Percentile ranking
- Section-by-section performance breakdown
- Personalized recommendations based on reading level
- Disclaimer about training/monitoring use only
- Retake assessment option

#### State Management

```typescript
- assessmentActive: boolean
- showResults: boolean
- currentSectionIdx: number
- currentQuestionIdx: number
- score: number
- answered: boolean
- selectedAnswer: number | null
- showFeedback: boolean
- sectionScores: Record<string, number>
- startTime: number | null
- isSaving: boolean
```

### 2. Assessment History Component

**File:** `/web/components/AssessmentHistory.tsx`

Displays past reading assessment attempts with:

- Chronological list of all attempts
- Assessment metadata (type, date, time)
- Key metrics per attempt:
  - Score (correct/total)
  - Accuracy percentage
  - WCPM (Words Correct Per Minute)
  - Reading level band and percentile
- Visual progress summary for multiple attempts
- Color-coded reading level badges

### 3. Database Models (Prisma)

**File:** `/web/prisma/schema.prisma`

#### Core Models

##### ReadingPassage

```prisma
- id: String (primary key)
- title: String
- text: String (passage content)
- wordCount: Int
- levelBand: String (beginner, elementary, intermediate, advanced)
- license: String (public-domain, cc0, user-authored, licensed)
- sourceAttribution: String?
- createdAt: DateTime
- readingAttempts: Relation
- comprehensionQuestions: Relation
```

##### WordList

```prisma
- id: String
- title: String
- description: String?
- levelBand: String
- words: String[] (array of words)
- wordCount: Int
- license: String
- createdAt: DateTime
- readingAttempts: Relation
```

##### PseudowordList

```prisma
- id: String
- title: String
- levelBand: String
- items: String[] (array of pseudowords)
- generatorParams: Json (pattern configuration)
- createdAt: DateTime
- readingAttempts: Relation
```

##### ComprehensionQuestion

```prisma
- id: String
- passageId: String (foreign key)
- passage: Relation
- prompt: String
- choices: Json (choice options)
- correctChoiceIndex: Int
- explanation: String?
- difficulty: String (easy, intermediate, hard)
```

##### ReadingAttempt

```prisma
- id: String
- deviceId: String
- assessmentType: String (orf, wordList, pseudoword, comprehension, quickAssessment)
- passageId: String? (foreign key)
- wordListId: String? (foreign key)
- pseudowordListId: String? (foreign key)
- startedAt: DateTime
- endedAt: DateTime?
- durationSeconds: Int
- totalWords: Int
- wordsCorrect: Int
- errorsTotal: Int
- accuracyPct: Float
- wcpm: Float (Words Correct Per Minute)
- selfCorrections: Int
- comprehensionScore: Float
- comprehensionCorrect: Int
- comprehensionTotal: Int
- readingLevelBand: String?
- readingLevelPercentile: Int
- notes: String?
- audioUrl: String?
- errorDetails: Relation (to AttemptErrorDetail)
- Indexes: [deviceId, createdAt], [deviceId, assessmentType], [passageId]
```

##### AttemptErrorDetail

```prisma
- id: String
- attemptId: String (foreign key)
- attempt: Relation
- wordIndex: Int
- wordText: String
- errorType: String (substitution, omission, insertion, reversal, hesitation, unknown)
- corrected: Boolean
```

### 4. API Routes

**File:** `/web/app/api/assessment/save-attempt/route.ts`

#### POST /api/assessment/save-attempt

Saves a reading assessment attempt to the database.

**Request Body:**

```json
{
  "deviceId": "string",
  "assessmentType": "quickAssessment|orf|wordList|pseudoword|comprehension",
  "totalWords": number,
  "wordsCorrect": number,
  "errorsTotal": number,
  "accuracyPct": number,
  "wcpm": number (optional),
  "selfCorrections": number (optional),
  "comprehensionCorrect": number (optional),
  "comprehensionTotal": number (optional),
  "readingLevelBand": string (optional),
  "readingLevelPercentile": number (optional),
  "durationSeconds": number,
  "passageId": string (optional),
  "wordListId": string (optional),
  "pseudowordListId": string (optional)
}
```

**Response:**

```json
{
  "success": true,
  "attempt": {
    "id": "string",
    "deviceId": "string",
    "assessmentType": "string",
    "accuracy": number,
    "wcpm": number,
    "readingLevel": "string",
    "createdAt": "ISO8601 datetime"
  }
}
```

#### GET /api/assessment/save-attempt?deviceId=xxx

Retrieves assessment history for a device.

**Response:**

```json
{
  "success": true,
  "count": number,
  "attempts": [
    {
      "id": "string",
      "assessmentType": "string",
      "totalWords": number,
      "wordsCorrect": number,
      "accuracyPct": number,
      "wcpm": number,
      "readingLevelBand": "string",
      "readingLevelPercentile": number,
      "durationSeconds": number,
      "createdAt": "ISO8601 datetime"
    }
  ]
}
```

### 5. Reading Assessment Utilities

**File:** `/web/lib/reading-assessment.ts`

Provides calculation and determination functions:

```typescript
// Calculate metrics from raw data
calculateReadingMetrics(
  totalWords: number,
  wordsCorrect: number,
  timeSeconds: number,
  selfCorrections?: number,
  uncorrectedErrors?: number
): ReadingMetrics

// Determine reading level from accuracy and WCPM
determineReadingLevel(
  accuracy: number,
  wcpm?: number,
  grade?: string
): ReadingLevelResult

// Quick assessment scoring
calculateQuickAssessmentLevel(
  score: number,
  totalQuestions: number
): ReadingLevelResult

// Difficulty band determination
determineDifficultyBand(
  wcpm: number,
  accuracy: number,
  previousLevel?: string
): string
```

### 6. Seed Data

**File:** `/web/lib/reading-assessment-seed.ts`

Includes:

- 4 sample passages (beginner to advanced levels)
- 4 word lists (sight words, phonics, intermediate, academic)
- 4 comprehension questions with explanations
- Pseudoword pattern templates for multiple difficulty levels

**File:** `/web/scripts/seed-reading-assessments.ts`

Run with: `npx tsx scripts/seed-reading-assessments.ts`

## Integration Points

### 1. Dyslexia Reading Training Page

**File:** `/web/app/dyslexia-reading-training/page.tsx`

The ReadingAssessment component is rendered as the second major section:

```tsx
{/* Evidence-Based Research Banner */}
{/* ReadingAssessment Component */}
{/* AssessmentHistory Component */}
{/* Hero Section... */}
```

### 2. Device Tracking

Uses existing device ID system from `/web/lib/device-id.ts` to track assessments across sessions without requiring authentication.

### 3. Database Connection

Uses Prisma ORM configured in `/web/lib/db.ts` for all database operations.

## Reading Level Bands

### Beginner (< 80% accuracy)

- Focus: Building foundational reading skills
- Recommendations:
  - Letter sounds and basic phonics daily
  - Multisensory reading techniques
  - High-frequency sight words
  - Short, simple stories with repetitive patterns
  - 1-2 minute sessions to avoid frustration

### Elementary (80-89% accuracy)

- Focus: Basic comprehension with improvement needed
- Recommendations:
  - Systematic phonics instruction
  - Blending and decoding multisyllabic words
  - Reading fluency with timed exercises
  - Guided comprehension questions
  - Graded readers matched to level

### Intermediate (90-95% accuracy)

- Focus: Good decoding and comprehension
- Recommendations:
  - Complex sentence structures
  - Age-appropriate chapter books
  - Inferencing and comprehension strategies
  - Vocabulary building in areas of interest
  - Reading strategies (predicting, summarizing)

### Advanced (96%+ accuracy)

- Focus: Ready for challenging materials
- Recommendations:
  - Literature and advanced texts
  - Critical reading and analysis
  - Reading widely across genres
  - Specialized reading strategies
  - Advanced reading programs

## Key Metrics Explained

### Accuracy Percentage (%)

`(Words Correct / Total Words) x 100`

Indicates the percentage of correctly read or answered items.

### WCPM (Words Correct Per Minute)

`Words Correct / (Time in Seconds / 60)`

Measures reading fluency and speed of accurate reading.

### Error Rate (%)

`(Errors / Total Words) x 100`

Tracks the percentage of errors or miscues.

### Percentile Ranking

Indicates what percentage of assessments fall below this score. For example, a 75th percentile means the student performed better than 75% of assessments.

## Usage Flow

1. **User navigates to Dyslexia Training page**
2. **User sees Reading Assessment card**
3. **User clicks "Start Assessment"**
4. **Assessment launches in full-screen modal**
5. **User completes 15 questions** across 4 sections
6. **Results screen displays** with:
   - Overall score and accuracy
   - Reading level band
   - Section performance breakdown
   - Personalized recommendations
7. **Assessment saved to database** (silent, in background)
8. **User can view history** in Assessment History section below
9. **User can retake assessment** to track progress

## Database Migration

Run the migration:

```bash
cd web
npx prisma migrate dev --name add_reading_assessment_models
```

Then seed initial data:

```bash
npx tsx scripts/seed-reading-assessments.ts
```

## File Structure

```text
web/
├── app/
│   ├── api/
│   │   └── assessment/
│   │       └── save-attempt/
│   │           └── route.ts
│   └── dyslexia-reading-training/
│       └── page.tsx (updated)
├── components/
│   ├── ReadingAssessment.tsx (enhanced)
│   └── AssessmentHistory.tsx (new)
├── lib/
│   ├── reading-assessment.ts (new)
│   ├── reading-assessment-seed.ts (new)
│   └── device-id.ts (used)
├── prisma/
│   └── schema.prisma (updated)
└── scripts/
    └── seed-reading-assessments.ts (new)
```

## Environment Variables

No new environment variables are required. The module uses:

- Existing `DATABASE_URL` for Prisma connections
- Existing device ID system (stored in localStorage)

## Testing Checklist

### Component Testing

- [ ] ReadingAssessment component renders without errors
- [ ] Can click "Start Assessment" button
- [ ] Modal displays full-screen
- [ ] First question appears with 4 answer options
- [ ] Progress bar shows correct percentage
- [ ] Score indicator at bottom updates correctly
- [ ] Can click answer and see immediate feedback
- [ ] Correct answers highlight green
- [ ] Incorrect answers highlight red
- [ ] Feedback message displays appropriately
- [ ] Can click "Next Question" to advance
- [ ] Progress through all 4 sections (15 questions total)
- [ ] Final question shows "Complete Assessment" button
- [ ] Results screen displays after completion

### Results Screen Testing

- [ ] Results screen shows with gradient background
- [ ] Award icon displays at top
- [ ] "Assessment Complete!" header visible
- [ ] Reading level band displays (e.g., "Intermediate")
- [ ] Description matches reading level
- [ ] Score shows correct count (e.g., "12/15")
- [ ] Accuracy percentage is correct (80%, 93%, etc.)
- [ ] Percentile ranking displays
- [ ] Performance bar shows accurate percentage
- [ ] Section performance breakdown displays all 4 sections
- [ ] Each section shows score and accuracy
- [ ] Recommendations section displays with tips
- [ ] Training/monitoring disclaimer visible
- [ ] "Retake Assessment" button works
- [ ] "Close Results" button works

### History Component Testing

- [ ] AssessmentHistory loads without errors
- [ ] Shows "No assessments yet" when empty
- [ ] After first assessment, shows attempt in history
- [ ] Attempt displays with correct metadata
- [ ] Score, accuracy, and reading level show correctly
- [ ] Date/time formatting is readable
- [ ] Multiple attempts display in reverse chronological order
- [ ] Can see trends across attempts
- [ ] Summary statistics show after multiple attempts

### Database Testing

- [ ] Prisma migration completes successfully
- [ ] ReadingAttempt is saved when assessment completes
- [ ] Can retrieve attempts via GET API endpoint
- [ ] AssessmentHistory component populates from DB

### Styling Testing

- [ ] Mobile responsive (test on small screens)
- [ ] Dark mode compatible
- [ ] Colors are dyslexia-friendly (high contrast)
- [ ] Font sizes are readable
- [ ] Buttons are clickable on both desktop and mobile

### Error Handling

- [ ] Network error doesn't crash component
- [ ] API errors show gracefully
- [ ] Missing deviceId handled properly
- [ ] Database failures show user-friendly message

## Known Limitations and Future Enhancements

### Current Scope (Implemented)

- Quick assessment with 15 questions
- Automatic reading level determination
- Result persistence to database
- Assessment history tracking
- Responsive design for mobile
- Training/monitoring disclaimer

### Future Enhancements (Not Yet Implemented)

**Oral Reading Fluency (ORF) Assessment:**

- Timed passage reading with word tracking
- Real-time marking mode for errors
- WCPM calculation

**Word List Assessments:**

- Single-word reading (timed/untimed)
- Timed mode with items-per-minute calculation

**Pseudoword Generation:**

- Deterministic generation using phoneme patterns
- By difficulty level (CVC to multi-syllabic)
- Collision avoidance with common words

**Audio Recording:**

- MediaRecorder API integration
- S3/R2-compatible cloud storage
- Audio playback in history

**Admin Content Management:**

- Interface to create/edit passages
- Add comprehension questions
- Manage word lists and difficulty bands

**Advanced Analytics:**

- Charts for WCPM progress over time
- Accuracy trend analysis
- Error pattern detection
- Export to PDF/CSV

**Adaptive Difficulty:**

- Questions adjust based on performance
- Targeted interventions based on error types

## Compliance and Safety

### Privacy

- All data uses device IDs (no personally identifying information required)
- No authentication required (works for anyone)
- Data stored in PostgreSQL database secured by platform

### Medical Compliance

- Clear disclaimer: "Training/monitoring only, not for diagnosis"
- Recommends qualified professionals for formal assessment
- No diagnostic labels or claims made
- Recommendations are educational, not medical

### Content Licensing

All seed content is:

- User-authored for educational purposes, OR
- Public domain, OR
- Will be marked with proper attribution

No copyrighted standardized tests reproduced.

## Support and Troubleshooting

### Component Won't Render

1. Check browser console for errors
2. Verify `/web/components/ReadingAssessment.tsx` exists
3. Verify imports in `/web/app/dyslexia-reading-training/page.tsx`
4. Clear `.next` cache: `rm -rf .next && yarn dev`

### Attempts Not Saving

1. Check `/web/app/api/assessment/save-attempt/route.ts` exists
2. Verify Prisma migration ran: `npx prisma migrate status`
3. Check database connection: `DATABASE_URL` env var set correctly
4. Check browser console for API errors

### History Not Loading

1. Verify device ID is being set: check localStorage in DevTools
2. Check API endpoint returns data: `curl http://localhost:3000/api/assessment/save-attempt?deviceId=test`
3. Verify database has ReadingAttempt records: `npx prisma studio`

### Styling Issues

1. Verify Tailwind CSS is configured properly
2. Check if dark mode CSS variables are applied
3. Test with `npm run build` to catch CSS errors

## Contact and Questions

For questions about implementation, refer to:

- Prisma documentation: <https://www.prisma.io/docs>
- Next.js App Router: <https://nextjs.org/docs/app>
- Dyslexia Association resources: <https://www.dyslexiaida.org>
