# Product Requirements Document: Reading Assessment & Placement System

**Version:** 1.0  
**Date:** December 29, 2025  
**Status:** Draft  

---

## 1. Executive Summary

The NeuroBreath Reading Assessment & Placement System provides a comprehensive, research-backed framework for evaluating reading abilities and placing learners into personalized training paths. The system serves children (ages 5-8), youth (9-12), adolescents (13-17), and adults (18+) with reading difficulties, particularly those with dyslexia.

### 1.1 Problem Statement

Learners with reading difficulties often receive generic interventions that don't address their specific skill gaps. Without accurate assessment and targeted placement, learners waste time on skills they've mastered while struggling with unaddressed weaknesses.

### 1.2 Solution

A multi-dimensional assessment system that:
- Evaluates 4 core reading skills (Decoding, Fluency, Comprehension, Phonological Awareness)
- Places learners into 9 progressive levels (NB-L0 through NB-L8)
- Generates personalized 4-week training plans
- Tracks progress and adjusts placement dynamically

---

## 2. Target Users

### 2.1 Learner Groups

| Group | Age Range | Characteristics |
|-------|-----------|-----------------|
| **Children** | 5-8 years | Early readers, developing phonemic awareness |
| **Youth** | 9-12 years | Building fluency and comprehension |
| **Adolescence** | 13-17 years | Addressing gaps, preparing for academic demands |
| **Adult** | 18+ years | Self-motivated, diverse learning histories |

### 2.2 User Personas

**Primary: The Learner**
- Completes assessments
- Follows personalized training plans
- Tracks progress through rewards and streaks

**Secondary: The Educator/Parent**
- Views learner progress reports
- Understands placement rationale
- Supports practice outside the app

---

## 3. Feature Requirements

### 3.1 Assessment Module (P0 - Must Have)

#### 3.1.1 Reading Check-In Dashboard
- **FR-001:** Display current reading level and profile summary
- **FR-002:** Show assessment history with dates and scores
- **FR-003:** Provide "Start Check-In" call-to-action button
- **FR-004:** Display skill breakdown chart (4 skills)

#### 3.1.2 Assessment Wizard
- **FR-010:** Multi-step assessment flow with progress indicator
- **FR-011:** Part 1 - Oral Reading Fluency (ORF) with 60-second timer
- **FR-012:** Part 2 - Word Reading accuracy test (10-20 words)
- **FR-013:** Part 3 - Pseudoword decoding test (10 words)
- **FR-014:** Part 4 - Comprehension questions (3-5 questions)
- **FR-015:** Skip functionality for frustrated learners
- **FR-016:** Audio recording for ORF (optional, for educator review)

#### 3.1.3 Results & Placement
- **FR-020:** Calculate reading profile from assessment data
- **FR-021:** Determine placement level (NB-L0 through NB-L8)
- **FR-022:** Generate confidence score for placement (0-100%)
- **FR-023:** Display personalized recommendations
- **FR-024:** Show comparison to previous assessment (if exists)

### 3.2 Placement Engine (P0 - Must Have)

#### 3.2.1 Rubric System
- **FR-030:** Calculate weighted skill scores
- **FR-031:** Apply age-adjusted scoring rubrics
- **FR-032:** Handle edge cases (very low/high performers)
- **FR-033:** Support manual placement override

#### 3.2.2 Training Plan Generator
- **FR-040:** Generate 4-week training plan based on placement
- **FR-041:** Select lessons from 45+ lesson catalog
- **FR-042:** Prioritize skills based on profile weaknesses
- **FR-043:** Balance lesson types (phonics, fluency, comprehension)
- **FR-044:** Include daily practice recommendations

### 3.3 Lesson Integration (P1 - Should Have)

#### 3.3.1 Lesson Catalog Access
- **FR-050:** Query lessons by level and skill focus
- **FR-051:** Track lesson completion status
- **FR-052:** Support lesson prerequisites
- **FR-053:** Recommend next lessons based on progress

#### 3.3.2 Progress Tracking
- **FR-060:** Record lesson attempts and scores
- **FR-061:** Update skill profiles after lesson completion
- **FR-062:** Trigger re-assessment prompts when appropriate
- **FR-063:** Calculate streak and reward eligibility

### 3.4 Reporting (P2 - Nice to Have)

- **FR-070:** Generate progress reports (PDF/printable)
- **FR-071:** Show growth over time charts
- **FR-072:** Provide educator/parent dashboard view
- **FR-073:** Export assessment data

---

## 4. Non-Functional Requirements

### 4.1 Performance
- **NFR-001:** Assessment wizard loads in < 2 seconds
- **NFR-002:** Placement calculation completes in < 500ms
- **NFR-003:** Plan generation completes in < 1 second

### 4.2 Accessibility
- **NFR-010:** WCAG 2.1 AA compliance
- **NFR-011:** Screen reader compatible
- **NFR-012:** Keyboard navigation support
- **NFR-013:** High contrast mode available

### 4.3 Security & Privacy
- **NFR-020:** Assessment data encrypted at rest
- **NFR-021:** COPPA compliance for children under 13
- **NFR-022:** Data retention policy (configurable)

### 4.4 Reliability
- **NFR-030:** Offline assessment capability (save locally, sync later)
- **NFR-031:** Auto-save progress during assessment
- **NFR-032:** Recovery from browser crash

---

## 5. Data Requirements

### 5.1 Assessment Data Captured

| Data Point | Type | Source |
|------------|------|--------|
| Words Correct Per Minute (WCPM) | number | ORF section |
| Total Words Attempted | number | ORF section |
| Errors Count | number | ORF section |
| Word Reading Accuracy | percentage | Word Reading section |
| Pseudoword Accuracy | percentage | Pseudoword section |
| Comprehension Score | percentage | Comprehension section |
| Time Per Question | seconds[] | All sections |
| Skip Count | number | All sections |

### 5.2 Derived Metrics

| Metric | Formula | Use |
|--------|---------|-----|
| Reading Fluency | WCPM adjusted for errors | Placement |
| Decoding Ability | (WordAcc + PseudoAcc) / 2 | Skill profile |
| Overall Reading Level | Weighted composite | Level assignment |
| Confidence Score | Consistency + completion | Placement certainty |

---

## 6. User Flows

### 6.1 First-Time Assessment Flow

```
[Landing Page] 
    → [Start Check-In] 
    → [Learner Info Form] 
    → [Assessment Part 1: ORF] 
    → [Assessment Part 2: Word Reading]
    → [Assessment Part 3: Pseudowords]
    → [Assessment Part 4: Comprehension]
    → [Results Screen]
    → [View Training Plan]
    → [Start First Lesson]
```

### 6.2 Returning User Flow

```
[Dashboard]
    → [View Current Level & Progress]
    → [Continue Training Plan] OR [Take New Check-In]
```

### 6.3 Re-Assessment Flow

```
[Dashboard]
    → [Prompted for Check-In (after 4 weeks)]
    → [Complete Assessment]
    → [View Progress Comparison]
    → [Updated Training Plan]
```

---

## 7. Success Metrics

### 7.1 Engagement Metrics
- Assessment completion rate > 80%
- Average time to complete assessment < 15 minutes
- Return rate for follow-up assessments > 60%

### 7.2 Learning Outcomes
- 70% of learners show level improvement within 8 weeks
- Skill profile accuracy validated by educator review
- Lesson completion rate > 50%

### 7.3 Technical Metrics
- Page load time < 2s (P95)
- API response time < 500ms (P95)
- Error rate < 0.1%

---

## 8. Out of Scope (v1.0)

- Real-time audio transcription for ORF
- AI-powered error detection
- Multi-language support
- Standardized test score correlation
- Integration with school LMS systems

---

## 9. Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Prisma ORM | Technical | ✅ Implemented |
| PostgreSQL | Infrastructure | ✅ Running |
| LessonCatalog | Data | ✅ 45 lessons seeded |
| shadcn/ui components | UI | ✅ Available |
| Speech synthesis API | Browser | ✅ Available |

---

## 10. Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 1: Core Assessment | 1 week | Assessment wizard, results screen |
| Phase 2: Placement Engine | 1 week | Rubric system, plan generator |
| Phase 3: Integration | 1 week | Lesson catalog connection, API endpoints |
| Phase 4: Polish | 1 week | Accessibility, error handling, testing |

---

## 11. Appendix

### A. NB Level Scale

| Level | Description | WCPM Range | Characteristics |
|-------|-------------|------------|-----------------|
| NB-L0 | Pre-Reader | 0-10 | Letter recognition, phonemic awareness |
| NB-L1 | Emergent | 10-30 | CVC words, basic sight words |
| NB-L2 | Beginning | 30-50 | Simple sentences, blending |
| NB-L3 | Early | 50-70 | Paragraphs, basic comprehension |
| NB-L4 | Transitional | 70-90 | Chapter books, fluency building |
| NB-L5 | Developing | 90-110 | Complex texts, vocabulary growth |
| NB-L6 | Fluent | 110-130 | Grade-level reading |
| NB-L7 | Proficient | 130-150 | Above grade-level |
| NB-L8 | Advanced | 150+ | Complex analysis, inference |

### B. Skill Weights by Age Group

| Skill | Children | Youth | Adolescence | Adult |
|-------|----------|-------|-------------|-------|
| Decoding | 40% | 30% | 20% | 15% |
| Fluency | 25% | 30% | 30% | 30% |
| Comprehension | 20% | 30% | 40% | 45% |
| Phonological | 15% | 10% | 10% | 10% |

---

*Document maintained by NeuroBreath Development Team*
