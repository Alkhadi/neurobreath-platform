# NeuroBreath Product Specification

**Version:** 2.1.0  
**Last Updated:** December 25, 2024  
**Document Owner:** Product Team  
**Status:** Living Document (updated as features evolve)

---

## 🎯 Executive Summary

NeuroBreath is a **neurodiversity-affirming digital platform** providing evidence-based breathing techniques, dyslexia reading training, and ADHD/autism support tools. The platform serves neurodivergent individuals (children, teens, adults) and their supporters (parents, teachers, carers) through accessible, sensory-safe, gamified tools that promote calm, focus, emotional regulation, and learning confidence.

### **Key Differentiators**
1. **Neuro-Inclusive Design**: Low-stimulation UI, sensory-safe animations, voice guidance
2. **Evidence-Informed**: Based on NHS mental health guidelines, dyslexia best practices
3. **Measurable Progress**: LocalStorage-based tracking without requiring user accounts
4. **Privacy-First**: No analytics, no tracking, all data stays on user's device
5. **Accessibility-First**: WCAG 2.1 Level AA compliance, screen reader compatible

---

## 🎯 Core Product Vision

### **Mission Statement**
> "Be the go-to, one-stop platform for neurodivergent support across the lifespan—empowering users to build calm, focus, emotional regulation, and learning confidence through structured, measurable, stigma-free tools."

### **North Star Metric**
**Definition**: NeuroBreath becomes the default first platform people open when they want:
- A quick tool for calm/focus/sleep
- A structured practice plan
- A game or challenge that builds a real skill
- A clear dashboard showing improvement
- Trusted guidance for parents/teachers/carers

**Measurement**: Weekly Active Users (WAU) completing 3+ sessions/week

---

## 👥 Target Audience

### **Primary Users**
1. **Neurodivergent Children** (8-12 years)
   - Needs: Simple instructions, gamification, visual feedback
   - Pain Points: Overwhelm, difficulty focusing, sensory sensitivities
   - Success Criteria: Completes 3-minute breathing session independently

2. **Neurodivergent Teens** (13-17 years)
   - Needs: Privacy, non-patronizing language, peer-appropriate design
   - Pain Points: Anxiety, executive dysfunction, academic pressure
   - Success Criteria: Uses platform daily for exam stress management

3. **Neurodivergent Adults** (18+ years)
   - Needs: Self-directed tools, workplace applicability, evidence-based methods
   - Pain Points: Burnout, emotional dysregulation, imposter syndrome
   - Success Criteria: Integrates breathing into daily routine (morning/work/sleep)

### **Secondary Users (Supporters)**
4. **Parents/Carers**
   - Needs: Easy-to-understand guidance, printable resources, progress visibility
   - Pain Points: Uncertainty about how to help, lack of time
   - Success Criteria: Downloads 3+ resources, sees child's progress dashboard

5. **Teachers/SENCOs**
   - Needs: Classroom-ready tools, differentiation strategies, evidence base
   - Pain Points: Large class sizes, limited training, resource scarcity
   - Success Criteria: Uses "Teacher Quick Pack" in class weekly

6. **Support Workers/Therapists**
   - Needs: Professional-grade tools, outcome tracking, client-facing materials
   - Pain Points: Limited budgets, need for scalable interventions
   - Success Criteria: Recommends platform to 5+ clients

---

## 🏛️ Product Architecture

### **Platform Components**

#### **1. Web Application** (Current)
- **Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, Radix UI
- **Deployment**: Cloudflare Pages + Workers (SSR)
- **Domain**: www.neurobreath.co.uk (canonical)
- **Hosting**: Cloudflare global CDN
- **Performance**: 140 kB homepage, 95+ Lighthouse scores

#### **2. Mobile Application** (Future - Q2 2025)
- **Tech Stack**: Flutter (iOS/Android)
- **Features**: Offline mode, push notifications, device sensors (breathing pace detection)
- **Distribution**: App Store, Google Play

#### **3. Backend Services** (Future - Q2 2025)
- **Tech Stack**: Cloudflare Workers, D1 Database, R2 Storage
- **Features**: User accounts, cross-device sync, analytics dashboard

---

## ✅ Feature Roadmap

### **Phase 1: MVP** ✅ Complete (Dec 2024)

#### **1.1 Breathing Techniques**
- **Box Breathing**: 4-4-4-4 pattern (16s cycle)
- **4-7-8 Breathing**: Inhale 4s, Hold 7s, Exhale 8s (19s cycle)
- **Coherent Breathing**: 5-5 pattern (10s cycle, HRV optimization)
- **SOS 60s Reset**: 4s inhale, 6s exhale (emergency technique)

**Features**:
- ✅ Fullscreen focus mode
- ✅ 1-10 minute session durations
- ✅ Voice coaching (3 modes: Pre-recorded audio, TTS, Off)
- ✅ 7 ambient sounds (Rain, Ocean, Forest, Fire, Singing Bowl, Wind Chimes)
- ✅ Driving safety warnings
- ✅ Progress tracking (breaths, cycles, time, sessions)
- ✅ LocalStorage persistence (last 100 sessions)

#### **1.2 Dyslexia Reading Training**
28+ interactive tools across 8 categories:

1. **Phonics Sounds Lab**: A-Z letter sounds with timed audio (Dorothy voice)
2. **Vowel Universe**: 90+ vowel patterns (short, long, r-controlled)
3. **Word Construction**: Drag-and-drop letter building
4. **Fluency Pacer**: WPM tracking with highlighted text
5. **Pronunciation Practice**: Speech recognition + IPA notation
6. **Syllable Splitter**: Tap-to-split exercises
7. **Vocabulary Recognition**: Flashcard spaced repetition
8. **Vocabulary Builder**: 30 common words with emoji aids
9. **Rhythm Training**: Clapping patterns for syllable awareness
10. **Rapid Naming Test**: Speed-based letter/number recognition
11. **Morphology Master**: Prefix/suffix/root training
12. **Letter Reversal Training**: b/d, p/q discrimination
13. **Blending & Segmenting Lab**: Phonological processing
14. **Downloadable Resources**: Printable worksheets, certificates

**Features**:
- ✅ Progress tracking across all tools
- ✅ Milestone celebrations with confetti animations
- ✅ Audio synchronization with letter timing
- ✅ Responsive design for tablets/mobile
- ✅ Accessibility attributes (ARIA labels)

#### **1.3 Playful Breathing Lab** (Homepage Gamification)
1. **Breath Ladder**: Progression from 3-3-3-3 to 5-5-5-5 patterns
2. **Colour-Path Breathing**: Sensory-safe visual orbs (Blue/Gold/Green)
3. **Focus Tiles**: Context-specific recipes (Study, Driving, Work, Sleep)
4. **Micro-Reset Roulette**: Spinning wheel for quick technique selection

**Features**:
- ✅ Interactive animations with smooth transitions
- ✅ Clinical backing for Focus Tiles (NHS/research citations)
- ✅ Safety warnings for driving/machinery contexts
- ✅ Progress unlocks (Colour-Path orbs unlock at level milestones)

#### **1.4 ADHD Deep Dive**
9 resource pages:
1. Assessment guidance
2. Diagnosis pathways
3. Helplines (UK-specific)
4. Self-care strategies
5. Support at home
6. Working with schools
7. Teen-specific support
8. Young adult transitions
9. "What is ADHD?" explainer

**Features**:
- ✅ Downloadable PDF checklists
- ✅ Clear signposting to NHS/charity resources
- ✅ Non-diagnostic, supportive tone

#### **1.5 Global Features**
- ✅ **Reading Buddy Chatbot**: Floating assistant for navigation + FAQ
- ✅ **Interactive Tutorial**: 12-step tooltip system for first-time users
- ✅ **Share System**: WhatsApp, Twitter, Copy Link, QR code (1024×1024 PNG)
- ✅ **Responsive Header**: Mega-menu with 4-tier dropdown navigation
- ✅ **Dark Mode Support**: Via `next-themes` with system preference detection

---

### **Phase 2: Polish** 🚧 In Progress (Q1 2025)

#### **2.1 Shop Integration**
- **Goal**: Replicate Neurogum-style product layout for energy/focus/sleep aids
- **Features**:
  - Product cards with images, descriptions, pricing
  - Category filtering (Energy, Focus, Sleep)
  - "Add to Cart" functionality
  - Checkout integration (Stripe)
- **Status**: Pending user feedback on product selection

#### **2.2 "Inside the Neurodivergent Brain" Research Deck**
- **Goal**: Evidence-based educational infographics
- **Features**:
  - Visual explanations of ADHD, autism, dyslexia neuroscience
  - Downloadable posters for schools/homes
  - Neurodiversity-affirming language
- **Status**: Research phase

#### **2.3 Enhanced Progress Dashboard**
- **Goal**: Consolidate all tracking into one visual dashboard
- **Features**:
  - Weekly/monthly session history graphs
  - Streak visualization (current + longest)
  - Badge showcase with unlock conditions
  - Export progress as PDF report
- **Status**: Design phase

#### **2.4 Performance Optimizations**
- **Goal**: Reduce bundle size, improve Core Web Vitals
- **Targets**:
  - Homepage: <130 kB (currently 140 kB)
  - LCP: <2.5s (currently ~2.8s)
  - CLS: <0.1 (currently 0.05)
- **Actions**:
  - Code splitting for dyslexia tools
  - Image optimization (WebP + lazy loading)
  - Font subsetting for reduced weight

---

### **Phase 3: Scale** 🔮 Planned (Q2 2025)

#### **3.1 Flutter Mobile App**
- **Platforms**: iOS 14+, Android 10+
- **Core Features**:
  - All web features ported to native
  - Offline mode (cached sessions + audio)
  - Push notifications for daily reminders
  - Haptic feedback for breathing rhythm
  - Device sensor integration (breathing pace detection via gyroscope)
- **Distribution**: Free download, optional in-app purchases for premium packs

#### **3.2 User Accounts + Authentication**
- **Tech**: NextAuth.js (email/password + OAuth)
- **Features**:
  - Cross-device sync via Cloudflare D1 Database
  - Family accounts (parent dashboard + child profiles)
  - Teacher accounts (classroom management)
  - Privacy controls (data export, deletion)

#### **3.3 Cloudflare Workers Backend**
- **Services**:
  - User data API (CRUD operations)
  - Progress sync endpoint
  - Email notifications (session reminders, milestone celebrations)
  - Admin dashboard (usage analytics, content management)

#### **3.4 Data Synchronization**
- **Goal**: Seamless experience across web + mobile
- **Architecture**:
  - Client-side: LocalStorage (fallback)
  - Server-side: Cloudflare D1 Database (primary)
  - Sync strategy: Last-write-wins with conflict resolution

---

### **Phase 4: Community** 🔮 Planned (Q3 2025)

#### **4.1 Teacher Dashboard**
- **Features**:
  - Classroom roster management
  - Assign breathing/dyslexia activities
  - View aggregated progress (anonymized)
  - Generate class reports
  - Downloadable lesson plans

#### **4.2 Parent/Carer Resources**
- **Features**:
  - "Parent Portal" with child progress visibility
  - Printable home routines
  - Video guides ("How to support dyslexia at home")
  - Community forums (moderated)

#### **4.3 AI Coaching System**
- **Tech**: OpenAI GPT-4 (fine-tuned on ADHD/autism/dyslexia support)
- **Features**:
  - Conversational guidance ("What breathing technique for exam anxiety?")
  - Personalized practice plans
  - Progress insights ("You've improved fluency by 15% this month")
  - Crisis detection + signposting ("I'm thinking about self-harm" → Samaritans)

#### **4.4 Blog + Q&A Platform**
- **Features**:
  - Expert-written articles (neurodiversity, mental health)
  - User-submitted questions (answered by team + AI)
  - SEO-optimized content for discoverability
  - Email newsletter integration

---

## 🎨 Design System

### **Visual Principles**
1. **Sensory Safety**: No flashing animations, subtle transitions, calm color palette
2. **Clear Hierarchy**: Large headings, ample whitespace, scannable layouts
3. **Consistent Patterns**: Reusable components, predictable navigation
4. **Accessibility First**: 4.5:1 contrast ratios, keyboard navigation, focus indicators

### **Color Palette** (Neuro-Inclusive)
- **Primary**: `#4A90E2` (Calm Blue) — trust, focus
- **Secondary**: `#50C878` (Soft Green) — success, growth
- **Accent**: `#FFB347` (Warm Orange) — energy, motivation
- **Neutral**: `#F5F5F5` (Light Gray) — backgrounds
- **Text**: `#2C3E50` (Dark Gray) — readability
- **Error**: `#E74C3C` (Muted Red) — alerts without alarm

### **Typography**
- **Headings**: Inter (sans-serif, dyslexia-friendly)
- **Body**: Inter (consistent with headings)
- **Code**: JetBrains Mono (optional, for developer tools)

### **Spacing System** (Tailwind scale)
- Base unit: 4px (0.25rem)
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px

---

## 🔒 Privacy & Security

### **Data Collection Policy**
- **LocalStorage Only**: All user data stored on device (no server-side tracking in Phase 1)
- **No Analytics**: No Google Analytics, no third-party trackers
- **No Cookies**: Except essential session cookies (future auth)
- **Data Retention**: User controls deletion via browser localStorage clear

### **GDPR Compliance** (Phase 2+)
- Right to access: Export progress as JSON
- Right to deletion: One-click account deletion
- Data portability: Download all data as CSV/PDF
- Consent management: Explicit opt-ins for features

### **Security Measures**
- **HTTPS Only**: Cloudflare SSL/TLS encryption
- **CSP Headers**: Content Security Policy to prevent XSS
- **Rate Limiting**: API throttling via Cloudflare Workers
- **Input Validation**: Server-side sanitization for all user inputs

---

## 📊 Success Metrics

### **Key Performance Indicators (KPIs)**

#### **User Engagement**
1. **Weekly Active Users (WAU)**: Target 1,000+ by Q2 2025
2. **Session Completion Rate**: Target 80%+ (users completing full breathing session)
3. **Return Rate**: Target 60%+ (users returning within 7 days)
4. **Daily Practice Streak**: Target 30%+ of users maintaining 7+ day streaks

#### **Feature Adoption**
1. **Breathing Techniques**: 70%+ of users try at least one technique
2. **Dyslexia Tools**: 40%+ of users complete one phonics lesson
3. **Playful Lab**: 50%+ of users interact with Breath Ladder or Roulette
4. **Share Features**: 20%+ of users share QR code or link

#### **Technical Performance**
1. **Page Load Time**: <3s (LCP) on 3G network
2. **Accessibility Score**: 95+ (Lighthouse)
3. **Uptime**: 99.9%+ (Cloudflare SLA)
4. **Error Rate**: <0.1% (JavaScript errors)

#### **Content Quality**
1. **Accessibility Compliance**: 100% of pages pass WCAG 2.1 Level AA
2. **Readability**: 100% of content at Grade 6-8 reading level (Flesch-Kincaid)
3. **Evidence Base**: 100% of clinical claims cited with sources

---

## 🛍️ Product Principles

### **1. Neurodiversity-Affirming**
- Avoid deficit language ("disorder", "symptoms", "fix")
- Celebrate neurodivergent strengths
- Center lived experience in design

### **2. Privacy-First**
- Default to no tracking
- Transparent data practices
- User controls all data

### **3. Evidence-Informed (Not Evidence-Based)**
- Informed by research, adapted for real-world use
- Acknowledge gaps in evidence
- Clear disclaimers (not medical advice)

### **4. Accessible by Default**
- WCAG 2.1 Level AA minimum
- Screen reader compatible
- Keyboard navigation
- Closed captions for all video

### **5. Ethical Gamification**
- No dark patterns (fake urgency, manipulative rewards)
- Grace days for streaks
- No-shame restart flows
- Optional gamification (can be disabled)

---

## 📝 Content Guidelines

### **Tone of Voice**
- **Supportive**: "You've got this" not "You need to fix this"
- **Clear**: Plain English, avoid jargon
- **Non-Patronizing**: Respect user intelligence
- **Honest**: Acknowledge limitations ("This helps many people, but not everyone")

### **Writing Standards**
- **Grade 6-8 Reading Level**: Flesch-Kincaid 60-70 score
- **Short Sentences**: <20 words average
- **Active Voice**: "Click the button" not "The button should be clicked"
- **Inclusive Language**: "They/them" as default, avoid gendered assumptions

### **Disclaimers** (Required on All Clinical Content)
> "NeuroBreath provides supportive tools and information, not medical advice. If you're in crisis, contact Samaritans (116 123) or your GP. This platform does not replace professional mental health care."

---

## 🔧 Technical Specifications

### **Browser Support**
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions (iOS 14+)
- No IE11 support

### **Performance Budgets**
- **JavaScript**: <200 kB gzipped (total)
- **CSS**: <50 kB gzipped
- **Images**: WebP with fallback, lazy loading
- **Fonts**: WOFF2, subset to Latin characters

### **API Requirements** (Future)
- **Response Time**: <200ms (p95)
- **Rate Limit**: 100 requests/minute per IP
- **Authentication**: JWT tokens, 1-hour expiry

---

## 🚀 Launch Checklist

### **Pre-Launch (Phase 1)**
- [x] Core features built and tested
- [x] Accessibility audit passed
- [x] Performance optimization complete
- [x] Browser testing (Chrome, Firefox, Safari)
- [x] Mobile responsive design verified
- [ ] Legal pages (Privacy Policy, Terms of Service)
- [ ] SEO optimization (meta tags, sitemap, robots.txt)
- [ ] Analytics setup (privacy-friendly alternative)

### **Post-Launch (Phase 2)**
- [ ] User feedback collection mechanism
- [ ] Bug tracking system (GitHub Issues)
- [ ] A/B testing framework
- [ ] Email newsletter signup
- [ ] Social media presence (Twitter, Instagram)

---

## 📞 Contact & Support

- **Website**: www.neurobreath.co.uk
- **Support Email**: support@neurobreath.co.uk
- **Bug Reports**: GitHub Issues (private repo)
- **Feature Requests**: Feedback form (homepage)

---

**Document History**
- v2.1.0 (Dec 25, 2024): Monorepo restructure, deployment planning
- v2.0.0 (Dec 24, 2024): Enhanced breathing features, audio guidance
- v1.0.0 (Dec 23, 2024): Initial MVP specification
