# UNIFIED DIFF SUMMARY - AI COACH UPGRADE

## File 1: components/blog/urgent-help-panel.tsx (NEW FILE)

```diff
+++ components/blog/urgent-help-panel.tsx
@@ -0,0 +1,75 @@
+'use client'
+
+import { Phone, MessageSquare, ExternalLink } from 'lucide-react'
+
+export default function UrgentHelpPanel() {
+  return (
+    <details className="border rounded-lg p-4 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
+      <summary className="cursor-pointer font-semibold text-sm flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">
+        <Phone className="w-4 h-4" />
+        Urgent help &amp; crisis support (UK-first)
+      </summary>
+      <div className="mt-4 space-y-3 text-sm">
+        <div className="space-y-2">
+          <p className="flex items-start gap-2">
+            <span className="text-red-600 dark:text-red-400 font-semibold shrink-0">999</span>
+            <span>If you or someone else is in immediate danger: call 999.</span>
+          </p>
+          
+          <p className="flex items-start gap-2">
+            <Phone className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
+            <span>
+              If you need urgent mental health help: use the{' '}
+              <a
+                href="https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/"
+                target="_blank"
+                rel="noopener noreferrer"
+                className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
+              >
+                NHS urgent help guidance
+                <ExternalLink className="w-3 h-3" />
+              </a>
+              {' '}and call NHS 111.
+            </span>
+          </p>
+          
+          <p className="flex items-start gap-2">
+            <Phone className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
+            <span>
+              To talk to someone now (UK &amp; ROI):{' '}
+              <a
+                href="https://www.samaritans.org/how-we-can-help/contact-samaritan/talk-us-phone/"
+                target="_blank"
+                rel="noopener noreferrer"
+                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
+              >
+                Samaritans 116 123
+              </a>
+              .
+            </span>
+          </p>
+          
+          <p className="flex items-start gap-2">
+            <MessageSquare className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
+            <span>
+              If you prefer text (UK):{' '}
+              <a
+                href="https://giveusashout.org/get-help/"
+                target="_blank"
+                rel="noopener noreferrer"
+                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
+              >
+                text SHOUT to 85258
+              </a>
+              .
+            </span>
+          </p>
+          
+          <p className="flex items-start gap-2 text-muted-foreground">
+            <span className="font-semibold shrink-0">US:</span>
+            <span>call/text 988; emergency 911.</span>
+          </p>
+        </div>
+      </div>
+    </details>
+  )
+}
```

---

## File 2: components/blog/how-to-ask-guide.tsx (NEW FILE)

```diff
+++ components/blog/how-to-ask-guide.tsx
@@ -0,0 +1,26 @@
+'use client'
+
+import { HelpCircle } from 'lucide-react'
+import { Card, CardContent } from '@/components/ui/card'
+
+export default function HowToAskGuide() {
+  return (
+    <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
+      <CardContent className="pt-4 pb-4">
+        <div className="flex items-start gap-3">
+          <HelpCircle className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
+          <div className="space-y-2">
+            <p className="font-semibold text-sm">How to ask for the best answer:</p>
+            <ul className="text-xs space-y-1 text-muted-foreground">
+              <li><span className="font-medium text-foreground">Age group:</span> child / teen / adult</li>
+              <li><span className="font-medium text-foreground">Setting:</span> home / school / work</li>
+              <li><span className="font-medium text-foreground">Main challenge:</span> sleep / sensory / routines / anxiety / etc.</li>
+              <li><span className="font-medium text-foreground">Goal:</span> today / this week / long-term</li>
+              <li><span className="font-medium text-foreground">Country:</span> UK / US / other (for pathways)</li>
+            </ul>
+          </div>
+        </div>
+      </CardContent>
+    </Card>
+  )
+}
```

---

## File 3: components/blog/ai-coach-chat.tsx (UPDATED)

```diff
--- a/components/blog/ai-coach-chat.tsx
+++ b/components/blog/ai-coach-chat.tsx
@@ -7,7 +7,7 @@ import { Input } from '@/components/ui/input'
 import { Badge } from '@/components/ui/badge'
 import { Alert, AlertDescription } from '@/components/ui/alert'
-import { Loader2, Send, ExternalLink, AlertTriangle, BookOpen, FileText } from 'lucide-react'
+import { Loader2, Send, ExternalLink, AlertTriangle, BookOpen, FileText, ShieldCheck } from 'lucide-react'
 import type { AICoachAnswer, AudienceType } from '@/types/ai-coach'
 import AudienceToggle from './audience-toggle'
 import PromptChips from './prompt-chips'
@@ -14,6 +14,8 @@ import EvidenceSnapshot from './evidence-snapshot'
 import VisualLearningCards from './visual-learning-cards'
 import AnswerCoverageBar from './answer-coverage-bar'
+import UrgentHelpPanel from './urgent-help-panel'
+import HowToAskGuide from './how-to-ask-guide'
 import Link from 'next/link'
 
@@ -103,8 +105,7 @@ export default function AICoachChat() {
           <div>
             <CardTitle className="text-2xl">Ask the AI Coach</CardTitle>
             <p className="text-sm text-muted-foreground mt-2">
-              Type any question about autism, ADHD, dyslexia, breathing, sleep, mood, or workplace strategies.
-              The agent summarises trusted guidance, links to site resources, and cites NHS/NICE/CDC/PubMed evidence where possible.
+              Evidence-led answers with NHS/NICE first (UK). Citations are provided for factual claims; if evidence is uncertain or mixed, we will say so.
             </p>
             <ul className="list-disc list-inside text-xs text-muted-foreground mt-4 space-y-1">
               <li>Scope: educational info only, not medical advice</li>
@@ -112,6 +113,20 @@ export default function AICoachChat() {
               <li>Sources: prioritises Google Scholar, PubMed, NHS, NICE, CDC, NIH, APA, university centres</li>
             </ul>
+            
+            {/* Urgent Help Panel */}
+            <div className="mt-4">
+              <UrgentHelpPanel />
+            </div>
+            
+            {/* Privacy Notice */}
+            <div className="mt-4 flex items-start gap-2 p-3 bg-muted/50 rounded-md border">
+              <ShieldCheck className="w-4 h-4 shrink-0 text-muted-foreground mt-0.5" />
+              <p className="text-xs text-muted-foreground">
+                <strong className="font-medium text-foreground">Privacy:</strong> Please do not share names, addresses, phone numbers, or identifiable medical records.
+              </p>
+            </div>
           </div>
           <Card className="bg-muted/50">
             <CardContent className="pt-6 space-y-2">
@@ -191,6 +206,9 @@ export default function AICoachChat() {
           )}
         </div>
 
+        {/* How to Ask Guide */}
+        <HowToAskGuide />
+
         {/* Chat Input */}
         <form onSubmit={handleSubmit} className="flex gap-2">
```

---

## File 4: lib/ai-coach/nice.ts (UPDATED)

```diff
--- a/lib/ai-coach/nice.ts
+++ b/lib/ai-coach/nice.ts
@@ -7,7 +7,8 @@ const NICE_LINKS: Record<string, EvidenceSource[]> = {
   ],
   autism: [
     { title: 'NICE CG142: Autism spectrum disorder in adults', url: 'https://www.nice.org.uk/guidance/cg142', kind: 'NICE' },
-    { title: 'NICE CG128: Autism spectrum disorder in under 19s', url: 'https://www.nice.org.uk/guidance/cg128', kind: 'NICE' }
+    { title: 'NICE CG128: Autism spectrum disorder in under 19s', url: 'https://www.nice.org.uk/guidance/cg128', kind: 'NICE' },
+    { title: 'NICE CG170: Autism spectrum disorder in under 19s: support and management', url: 'https://www.nice.org.uk/guidance/cg170', kind: 'NICE' }
   ],
   depression: [
     { title: 'NICE NG222: Depression in adults', url: 'https://www.nice.org.uk/guidance/ng222', kind: 'NICE' }
```

---

## File 5: components/blog/hero-section.tsx (NO CHANGES - ALREADY CORRECT)

Button styling is already production-ready:
- Uses `<Button>` component ✅
- Correct `bg-primary hover:bg-primary/90` ✅
- No dark mode conflicts ✅
- Proper contrast ✅

---

## LINES CHANGED SUMMARY

| File | Status | Lines Added | Lines Removed | Net Change |
|------|--------|-------------|---------------|------------|
| urgent-help-panel.tsx | NEW | 75 | 0 | +75 |
| how-to-ask-guide.tsx | NEW | 26 | 0 | +26 |
| ai-coach-chat.tsx | UPDATED | 21 | 3 | +18 |
| nice.ts | UPDATED | 1 | 0 | +1 |
| hero-section.tsx | NO CHANGE | 0 | 0 | 0 |
| **TOTAL** | | **123** | **3** | **+120** |

---

## BUILD VERIFICATION

```bash
# TypeScript compilation
✅ tsc --noEmit

# Linter
✅ eslint components/blog/*.tsx lib/ai-coach/*.ts

# Build
✅ next build
```

**Result:** All checks pass. No errors.

---

**Implementation Complete**  
**Date:** December 31, 2025  
**Status:** Production-ready




