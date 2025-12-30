# Technical Specification: Reading Assessment & Placement System

**Version:** 1.0  
**Date:** December 29, 2025  
**Status:** Draft  

---

## 1. System Architecture

### 1.1 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  ReadingCheckIn  │  AssessmentWizard  │  TrainingPlanView       │
│  Dashboard       │  Component          │  Component              │
└────────┬─────────┴─────────┬───────────┴──────────┬─────────────┘
         │                   │                      │
         ▼                   ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Layer                                │
├─────────────────────────────────────────────────────────────────┤
│  /api/assessment/*  │  /api/placement/*  │  /api/lessons/*      │
└────────┬────────────┴─────────┬──────────┴──────────┬───────────┘
         │                      │                     │
         ▼                      ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Business Logic                            │
├─────────────────────────────────────────────────────────────────┤
│  placement-rubric.ts  │  placement-plan.ts  │  placement-levels  │
└────────┬──────────────┴─────────┬───────────┴───────────────────┘
         │                        │
         ▼                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Data Layer (Prisma)                          │
├─────────────────────────────────────────────────────────────────┤
│  ReadingAttempt  │  LearnerPlacement  │  LessonCatalog          │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Next.js (App Router) | 14.2.35 |
| UI Components | shadcn/ui + Tailwind | Latest |
| State Management | React useState/useContext | 18.x |
| API | Next.js API Routes | 14.x |
| ORM | Prisma | 6.7.0 |
| Database | PostgreSQL | 14+ |
| Testing | Jest + React Testing Library | Latest |

---

## 2. Database Schema

### 2.1 Core Models

```prisma
// Existing in schema.prisma - ReadingAttempt
model ReadingAttempt {
  id                    String    @id @default(cuid())
  visitorId             String
  
  // ORF Metrics
  passageId             String?
  wordsCorrect          Int       @default(0)
  totalWords            Int       @default(0)
  errorsCount           Int       @default(0)
  readingTimeSeconds    Int       @default(0)
  
  // Word Reading
  wordListId            String?
  wordAccuracy          Float     @default(0)
  
  // Pseudowords
  pseudowordListId      String?
  pseudowordAccuracy    Float     @default(0)
  
  // Comprehension
  comprehensionScore    Float     @default(0)
  
  // Calculated
  wcpm                  Float     @default(0)
  readingLevel          String    @default("beginner")
  percentileRank        Int?
  
  // Placement fields
  learnerGroup          String?   // children, youth, adolescence, adult
  placementLevel        String?   // NB-L0 through NB-L8
  placementConfidence   Float?    // 0-100
  placementPlanJson     Json?     // 4-week training plan
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  errors                AttemptErrorDetail[]
  wordResponses         AttemptWordResponse[]
}

// Existing - LessonCatalog
model LessonCatalog {
  id              String   @id @default(cuid())
  lessonId        String   @unique
  title           String
  description     String
  skillFocus      String   // decoding, fluency, comprehension, phonological
  nbLevel         String   // NB-L0 through NB-L8
  durationMinutes Int      @default(10)
  prerequisites   String[] @default([])
  contentJson     Json?
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// Existing - LearnerPlacement
model LearnerPlacement {
  id                  String   @id @default(cuid())
  visitorId           String   @unique
  currentLevel        String   // NB-L0 through NB-L8
  learnerGroup        String   // children, youth, adolescence, adult
  
  // Skill profile (0-100 each)
  decodingScore       Float    @default(0)
  fluencyScore        Float    @default(0)
  comprehensionScore  Float    @default(0)
  phonologicalScore   Float    @default(0)
  
  // Plan tracking
  currentPlanJson     Json?
  planStartDate       DateTime?
  planWeek            Int      @default(1)
  lessonsCompleted    String[] @default([])
  
  lastAssessmentId    String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

### 2.2 Entity Relationships

```
ReadingAttempt 1──────* AttemptErrorDetail
ReadingAttempt 1──────* AttemptWordResponse
ReadingAttempt *──────1 ReadingPassage
ReadingAttempt *──────1 WordList
ReadingAttempt *──────1 PseudowordList

LearnerPlacement 1────1 ReadingAttempt (last assessment)
LearnerPlacement *────* LessonCatalog (via lessonsCompleted)
```

---

## 3. API Contract

### 3.1 Assessment Endpoints

#### POST /api/assessment/save-attempt

Save a completed assessment attempt.

**Request:**
```typescript
interface SaveAttemptRequest {
  visitorId: string;
  learnerGroup: 'children' | 'youth' | 'adolescence' | 'adult';
  
  // ORF data
  passageId?: string;
  wordsCorrect: number;
  totalWords: number;
  errorsCount: number;
  readingTimeSeconds: number;
  
  // Word reading
  wordListId?: string;
  wordAccuracy: number; // 0-100
  
  // Pseudowords
  pseudowordListId?: string;
  pseudowordAccuracy: number; // 0-100
  
  // Comprehension
  comprehensionScore: number; // 0-100
  
  // Error details (optional)
  errors?: {
    word: string;
    errorType: string;
    position: number;
  }[];
}
```

**Response:**
```typescript
interface SaveAttemptResponse {
  success: boolean;
  attempt: {
    id: string;
    wcpm: number;
    readingLevel: string;
    percentileRank: number;
    placementLevel: string;
    placementConfidence: number;
    placementPlanJson: TrainingPlan;
  };
}
```

#### GET /api/assessment/history

Get assessment history for a visitor.

**Query Parameters:**
- `visitorId` (required): Visitor identifier
- `limit` (optional): Number of results (default: 10)

**Response:**
```typescript
interface HistoryResponse {
  attempts: {
    id: string;
    createdAt: string;
    wcpm: number;
    readingLevel: string;
    placementLevel: string;
    skillProfile: {
      decoding: number;
      fluency: number;
      comprehension: number;
      phonological: number;
    };
  }[];
}
```

### 3.2 Placement Endpoints

#### POST /api/placement/calculate

Calculate placement from assessment results.

**Request:**
```typescript
interface CalculatePlacementRequest {
  visitorId: string;
  attemptId: string;
}
```

**Response:**
```typescript
interface CalculatePlacementResponse {
  placement: {
    level: string; // NB-L0 through NB-L8
    confidence: number; // 0-100
    skillProfile: {
      decoding: number;
      fluency: number;
      comprehension: number;
      phonological: number;
    };
    recommendations: string[];
  };
}
```

#### POST /api/placement/generate-plan

Generate a 4-week training plan.

**Request:**
```typescript
interface GeneratePlanRequest {
  visitorId: string;
  placementLevel: string;
  learnerGroup: string;
  skillProfile: {
    decoding: number;
    fluency: number;
    comprehension: number;
    phonological: number;
  };
}
```

**Response:**
```typescript
interface GeneratePlanResponse {
  plan: TrainingPlan;
}

interface TrainingPlan {
  weeks: WeekPlan[];
  focusSkills: string[];
  estimatedDailyMinutes: number;
}

interface WeekPlan {
  weekNumber: number;
  theme: string;
  lessons: {
    lessonId: string;
    title: string;
    skillFocus: string;
    dayOfWeek: number; // 1-7
    durationMinutes: number;
  }[];
  practiceActivities: string[];
}
```

### 3.3 Lesson Endpoints

#### GET /api/lessons

Get lessons from catalog.

**Query Parameters:**
- `level` (optional): Filter by NB level
- `skill` (optional): Filter by skill focus
- `limit` (optional): Number of results

**Response:**
```typescript
interface LessonsResponse {
  lessons: {
    id: string;
    lessonId: string;
    title: string;
    description: string;
    skillFocus: string;
    nbLevel: string;
    durationMinutes: number;
  }[];
}
```

#### POST /api/lessons/complete

Mark a lesson as completed.

**Request:**
```typescript
interface CompleteLessonRequest {
  visitorId: string;
  lessonId: string;
  score?: number; // 0-100
  timeSpentSeconds?: number;
}
```

---

## 4. Business Logic

### 4.1 Placement Rubric (placement-rubric.ts)

```typescript
// Core types
interface AssessmentResults {
  wcpm: number;
  wordAccuracy: number;      // 0-100
  pseudowordAccuracy: number; // 0-100
  comprehensionScore: number; // 0-100
  errorsCount: number;
  totalWords: number;
}

interface ReadingProfile {
  decoding: number;      // 0-100
  fluency: number;       // 0-100
  comprehension: number; // 0-100
  phonological: number;  // 0-100
}

interface PlacementResult {
  level: NBLevel;
  confidence: number;
  profile: ReadingProfile;
  recommendations: string[];
}

// Main function
function calculatePlacement(
  results: AssessmentResults,
  learnerGroup: LearnerGroup
): PlacementResult;

// Skill calculation
function calculateReadingProfile(
  results: AssessmentResults,
  learnerGroup: LearnerGroup
): ReadingProfile;

// Level determination
function determineNBLevel(
  profile: ReadingProfile,
  learnerGroup: LearnerGroup
): { level: NBLevel; confidence: number };
```

### 4.2 Skill Weights

```typescript
const SKILL_WEIGHTS: Record<LearnerGroup, SkillWeights> = {
  children: {
    decoding: 0.40,
    fluency: 0.25,
    comprehension: 0.20,
    phonological: 0.15,
  },
  youth: {
    decoding: 0.30,
    fluency: 0.30,
    comprehension: 0.30,
    phonological: 0.10,
  },
  adolescence: {
    decoding: 0.20,
    fluency: 0.30,
    comprehension: 0.40,
    phonological: 0.10,
  },
  adult: {
    decoding: 0.15,
    fluency: 0.30,
    comprehension: 0.45,
    phonological: 0.10,
  },
};
```

### 4.3 Training Plan Generator (placement-plan.ts)

```typescript
// Core function
function generateTrainingPlan(
  level: NBLevel,
  profile: ReadingProfile,
  learnerGroup: LearnerGroup,
  lessonCatalog: LessonCatalog[]
): TrainingPlan;

// Lesson selection algorithm
function selectLessonsForWeek(
  weekNumber: number,
  level: NBLevel,
  focusSkills: string[],
  catalog: LessonCatalog[],
  completedLessons: string[]
): LessonAssignment[];

// Practice recommendations
function generatePracticeActivities(
  profile: ReadingProfile,
  weekNumber: number
): string[];
```

### 4.4 Level Thresholds

```typescript
const LEVEL_THRESHOLDS: Record<NBLevel, LevelCriteria> = {
  'NB-L0': { minWCPM: 0,   maxWCPM: 10,  minComposite: 0 },
  'NB-L1': { minWCPM: 10,  maxWCPM: 30,  minComposite: 15 },
  'NB-L2': { minWCPM: 30,  maxWCPM: 50,  minComposite: 30 },
  'NB-L3': { minWCPM: 50,  maxWCPM: 70,  minComposite: 45 },
  'NB-L4': { minWCPM: 70,  maxWCPM: 90,  minComposite: 55 },
  'NB-L5': { minWCPM: 90,  maxWCPM: 110, minComposite: 65 },
  'NB-L6': { minWCPM: 110, maxWCPM: 130, minComposite: 75 },
  'NB-L7': { minWCPM: 130, maxWCPM: 150, minComposite: 85 },
  'NB-L8': { minWCPM: 150, maxWCPM: 999, minComposite: 90 },
};
```

---

## 5. Component Architecture

### 5.1 Component Tree

```
ReadingCheckIn (Dashboard)
├── SkillRadarChart
├── AssessmentHistoryList
├── CurrentLevelCard
└── StartCheckInButton
    └── AssessmentWizard (Modal/Full-page)
        ├── ProgressStepper
        ├── LearnerInfoForm
        ├── ORFAssessment
        │   ├── PassageDisplay
        │   ├── Timer
        │   └── WordTracker
        ├── WordReadingTest
        │   └── WordCard
        ├── PseudowordTest
        │   └── WordCard
        ├── ComprehensionTest
        │   └── QuestionCard
        └── ResultsScreen
            ├── ScoreSummary
            ├── SkillBreakdown
            ├── PlacementCard
            └── TrainingPlanPreview
                └── WeeklySchedule
```

### 5.2 State Management

```typescript
// Assessment context
interface AssessmentState {
  currentStep: number;
  learnerInfo: LearnerInfo | null;
  orfData: ORFData | null;
  wordReadingData: WordReadingData | null;
  pseudowordData: PseudowordData | null;
  comprehensionData: ComprehensionData | null;
  results: PlacementResult | null;
  isSubmitting: boolean;
  error: string | null;
}

// Actions
type AssessmentAction =
  | { type: 'SET_LEARNER_INFO'; payload: LearnerInfo }
  | { type: 'COMPLETE_ORF'; payload: ORFData }
  | { type: 'COMPLETE_WORD_READING'; payload: WordReadingData }
  | { type: 'COMPLETE_PSEUDOWORDS'; payload: PseudowordData }
  | { type: 'COMPLETE_COMPREHENSION'; payload: ComprehensionData }
  | { type: 'SET_RESULTS'; payload: PlacementResult }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET' };
```

---

## 6. Testing Strategy

### 6.1 Unit Tests

**placement-rubric.test.ts:**
```typescript
describe('calculatePlacement', () => {
  it('should place pre-reader at NB-L0', () => {
    const results = { wcpm: 5, wordAccuracy: 20, ... };
    const placement = calculatePlacement(results, 'children');
    expect(placement.level).toBe('NB-L0');
  });

  it('should apply age-adjusted weights', () => {
    const results = { wcpm: 80, wordAccuracy: 70, comprehensionScore: 90, ... };
    const childPlacement = calculatePlacement(results, 'children');
    const adultPlacement = calculatePlacement(results, 'adult');
    // Adult should be placed higher due to comprehension weight
    expect(adultPlacement.profile.comprehension).toBeGreaterThan(childPlacement.profile.comprehension);
  });

  it('should calculate confidence based on consistency', () => {
    const consistentResults = { wcpm: 75, wordAccuracy: 75, pseudowordAccuracy: 75, comprehensionScore: 75 };
    const inconsistentResults = { wcpm: 100, wordAccuracy: 30, pseudowordAccuracy: 80, comprehensionScore: 50 };
    
    const consistent = calculatePlacement(consistentResults, 'youth');
    const inconsistent = calculatePlacement(inconsistentResults, 'youth');
    
    expect(consistent.confidence).toBeGreaterThan(inconsistent.confidence);
  });
});
```

**placement-plan.test.ts:**
```typescript
describe('generateTrainingPlan', () => {
  it('should create 4-week plan', () => {
    const plan = generateTrainingPlan('NB-L3', mockProfile, 'youth', mockCatalog);
    expect(plan.weeks).toHaveLength(4);
  });

  it('should prioritize weak skills', () => {
    const profile = { decoding: 30, fluency: 80, comprehension: 70, phonological: 50 };
    const plan = generateTrainingPlan('NB-L3', profile, 'youth', mockCatalog);
    
    const decodingLessons = plan.weeks.flatMap(w => w.lessons.filter(l => l.skillFocus === 'decoding'));
    expect(decodingLessons.length).toBeGreaterThan(2);
  });

  it('should not exceed daily time limits', () => {
    const plan = generateTrainingPlan('NB-L5', mockProfile, 'children', mockCatalog);
    
    plan.weeks.forEach(week => {
      const dailyMinutes = {};
      week.lessons.forEach(l => {
        dailyMinutes[l.dayOfWeek] = (dailyMinutes[l.dayOfWeek] || 0) + l.durationMinutes;
      });
      Object.values(dailyMinutes).forEach(minutes => {
        expect(minutes).toBeLessThanOrEqual(30); // Max 30 min/day for children
      });
    });
  });
});
```

### 6.2 Integration Tests

```typescript
describe('Assessment Flow Integration', () => {
  it('should complete full assessment and generate placement', async () => {
    // 1. Submit assessment
    const attemptRes = await fetch('/api/assessment/save-attempt', {
      method: 'POST',
      body: JSON.stringify(mockAssessmentData),
    });
    const { attempt } = await attemptRes.json();
    
    expect(attempt.placementLevel).toMatch(/^NB-L[0-8]$/);
    expect(attempt.placementPlanJson.weeks).toHaveLength(4);
    
    // 2. Verify placement saved
    const placementRes = await fetch(`/api/placement/${attempt.visitorId}`);
    const { placement } = await placementRes.json();
    
    expect(placement.currentLevel).toBe(attempt.placementLevel);
  });
});
```

### 6.3 Test Coverage Requirements

| Module | Min Coverage |
|--------|--------------|
| placement-rubric.ts | 90% |
| placement-plan.ts | 90% |
| placement-levels.ts | 95% |
| API routes | 80% |
| Components | 70% |

---

## 7. Error Handling

### 7.1 API Error Responses

```typescript
interface APIError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

// Error codes
const ERROR_CODES = {
  INVALID_INPUT: 'INVALID_INPUT',
  ASSESSMENT_NOT_FOUND: 'ASSESSMENT_NOT_FOUND',
  PLACEMENT_FAILED: 'PLACEMENT_FAILED',
  LESSON_NOT_FOUND: 'LESSON_NOT_FOUND',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const;
```

### 7.2 Client-Side Error Handling

```typescript
// Assessment wizard error states
interface AssessmentError {
  step: number;
  type: 'validation' | 'network' | 'timeout' | 'unknown';
  message: string;
  recoverable: boolean;
}

// Recovery actions
const ERROR_RECOVERY = {
  validation: 'Please check your input and try again',
  network: 'Check your connection. Your progress has been saved.',
  timeout: 'The request timed out. Click to retry.',
  unknown: 'Something went wrong. Please try again.',
};
```

---

## 8. Performance Considerations

### 8.1 Optimization Strategies

1. **Lazy Loading:** Assessment wizard loaded on demand
2. **Lesson Catalog Caching:** Cache catalog in memory (revalidate hourly)
3. **Debounced Auto-save:** Save progress every 5 seconds during assessment
4. **Optimistic Updates:** Update UI before API confirmation

### 8.2 Database Indexes

```prisma
model ReadingAttempt {
  @@index([visitorId, createdAt(sort: Desc)])
  @@index([placementLevel])
}

model LessonCatalog {
  @@index([nbLevel, skillFocus])
  @@index([isActive])
}

model LearnerPlacement {
  @@index([currentLevel])
}
```

---

## 9. Security Considerations

### 9.1 Input Validation

- Validate all API inputs with Zod schemas
- Sanitize user-provided content (passage text, responses)
- Rate limit assessment submissions (max 5 per hour per visitor)

### 9.2 Data Privacy

- Use visitor IDs (not personally identifiable)
- Support data deletion requests
- Encrypt sensitive fields (if storing audio recordings)

---

## 10. Deployment Checklist

- [ ] Run database migrations: `npx prisma migrate deploy`
- [ ] Seed lesson catalog: `npx tsx scripts/seed-lessons.ts`
- [ ] Verify environment variables
- [ ] Run test suite: `yarn test`
- [ ] Build production: `yarn build`
- [ ] Verify API endpoints responding
- [ ] Test assessment flow end-to-end
- [ ] Monitor error rates post-deploy

---

*Technical specification maintained by NeuroBreath Engineering Team*
