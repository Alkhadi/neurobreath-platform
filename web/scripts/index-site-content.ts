/**
 * Content Indexer — crawls the public neurobreath.co.uk site and writes
 * page content chunks + navigation entries to Firestore.
 *
 * Usage:
 *   cd web && npx tsx scripts/index-site-content.ts
 *
 * Requires env vars:
 *   FIREBASE_SERVICE_ACCOUNT_KEY   (admin SDK JSON)
 *   SITE_INDEX_BASE_URL            (default: https://neurobreath.co.uk)
 *
 * This script is idempotent — re-running overwrites existing docs.
 */

import * as cheerio from "cheerio";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// ─── Config ──────────────────────────────────────────────────────────────────

const BASE_URL = process.env.SITE_INDEX_BASE_URL || "https://neurobreath.co.uk";

/** Public pages to index. Add new routes here as the site grows. */
const PAGES_TO_INDEX: Array<{ path: string; title: string; description: string; keywords: string[]; parent?: string }> = [
  { path: "/", title: "Home", description: "NeuroBreath homepage — neurodivergent-friendly breathing & wellbeing tools", keywords: ["home", "neurobreath", "start"] },
  { path: "/adhd", title: "ADHD Hub", description: "ADHD-specific breathing techniques, tools, and evidence-based support", keywords: ["adhd", "attention", "focus", "hyperactivity"] },
  { path: "/adhd/pathway", title: "ADHD Pathway", description: "Structured ADHD breathing pathway with progress tracking", keywords: ["adhd pathway", "adhd journey", "adhd programme"] },
  { path: "/autism", title: "Autism Hub", description: "Autism-friendly breathing and sensory regulation tools", keywords: ["autism", "asd", "sensory", "regulation", "autistic"] },
  { path: "/autism/pathway", title: "Autism Pathway", description: "Structured autism breathing pathway", keywords: ["autism pathway", "autism journey"] },
  { path: "/autism/focus-garden", title: "Focus Garden", description: "Visual focus and sensory garden for autistic users", keywords: ["focus garden", "sensory garden", "focus"] },
  { path: "/anxiety", title: "Anxiety Hub", description: "Anxiety management with breathing techniques and coping tools", keywords: ["anxiety", "worry", "panic", "calm", "anxious"] },
  { path: "/anxiety/pathway", title: "Anxiety Pathway", description: "Structured anxiety management pathway", keywords: ["anxiety pathway", "anxiety journey"] },
  { path: "/sleep", title: "Sleep Hub", description: "Sleep improvement tools and breathing techniques for better rest", keywords: ["sleep", "insomnia", "rest", "bedtime", "night"] },
  { path: "/sleep/pathway", title: "Sleep Pathway", description: "Structured sleep improvement pathway", keywords: ["sleep pathway", "sleep journey"] },
  { path: "/stress", title: "Stress Hub", description: "Stress management and resilience-building tools", keywords: ["stress", "burnout", "overwhelm", "pressure"] },
  { path: "/wellbeing", title: "Wellbeing", description: "General wellbeing dashboard and tools", keywords: ["wellbeing", "wellness", "health", "mental health"] },
  { path: "/breathing", title: "Breathing Hub", description: "All breathing techniques and exercises", keywords: ["breathing", "breathwork", "exercises", "techniques"] },
  { path: "/breathing/focus", title: "Focus Breathing", description: "Breathing exercises for improving focus and concentration", keywords: ["focus breathing", "concentration"] },
  { path: "/breathing/mindfulness", title: "Mindfulness Breathing", description: "Mindfulness-based breathing exercises", keywords: ["mindfulness", "meditation", "mindful breathing"] },
  { path: "/breathing/breath", title: "Breath Trainer", description: "Interactive breath training tool", keywords: ["breath trainer", "breath practice"] },
  { path: "/techniques/4-7-8", title: "4-7-8 Breathing", description: "The 4-7-8 breathing technique for relaxation and sleep", keywords: ["4-7-8", "relaxation", "sleep technique"] },
  { path: "/techniques/box-breathing", title: "Box Breathing", description: "Box breathing (square breathing) technique for calm and focus", keywords: ["box breathing", "square breathing"] },
  { path: "/techniques/coherent", title: "Coherent Breathing", description: "Coherent breathing technique for heart rate variability", keywords: ["coherent breathing", "hrv"] },
  { path: "/techniques/sos", title: "SOS Breathing", description: "Emergency SOS breathing technique for immediate calm", keywords: ["sos", "emergency", "panic", "quick calm"] },
  { path: "/resources", title: "Resources", description: "Downloadable resources, printables, and guides", keywords: ["resources", "downloads", "printables", "guides", "pdf"] },
  { path: "/schools", title: "Schools", description: "NeuroBreath for schools — classroom breathing tools", keywords: ["schools", "classroom", "teacher", "education", "sen"] },
  { path: "/teacher-quick-pack", title: "Teacher Quick Pack", description: "Quick-start resources for teachers and educators", keywords: ["teacher", "quick pack", "educator"] },
  { path: "/get-started", title: "Get Started", description: "Onboarding guide to begin using NeuroBreath", keywords: ["get started", "onboarding", "begin", "new user"] },
  { path: "/about", title: "About", description: "About NeuroBreath — mission, team, and approach", keywords: ["about", "mission", "team"] },
  { path: "/contact", title: "Contact", description: "Contact NeuroBreath team", keywords: ["contact", "email", "help", "support"] },
  { path: "/support-us", title: "Support Us", description: "Support NeuroBreath — donate or become a supporter", keywords: ["support", "donate", "donation", "supporter"] },
  { path: "/trust", title: "Trust & Safety", description: "Trust, safeguarding, and evidence base information", keywords: ["trust", "safety", "safeguarding", "evidence"] },
  { path: "/trust/sources", title: "Sources", description: "Evidence sources and references used by NeuroBreath", keywords: ["sources", "evidence", "references", "citations"] },
  { path: "/trust/safeguarding", title: "Safeguarding", description: "Safeguarding policy and procedures", keywords: ["safeguarding", "child protection", "safety policy"] },
  { path: "/trust/accessibility", title: "Accessibility", description: "Accessibility statement and WCAG compliance", keywords: ["accessibility", "wcag", "a11y"] },
  { path: "/blog", title: "Blog", description: "NeuroBreath blog — articles on breathing, ADHD, autism, and wellbeing", keywords: ["blog", "articles", "news"] },
  { path: "/downloads", title: "Downloads", description: "Downloadable tools and printable resources", keywords: ["downloads", "printables", "pdf"] },
  { path: "/pricing", title: "Pricing", description: "NeuroBreath pricing and plans", keywords: ["pricing", "plans", "cost", "free"] },
  { path: "/games/word-builder", title: "Word Builder Game", description: "Educational word-building game for literacy", keywords: ["word builder", "game", "literacy", "spelling"] },
  { path: "/games/sound-matching", title: "Sound Matching Game", description: "Sound matching educational game", keywords: ["sound matching", "game", "phonics"] },
  { path: "/games/reading-comprehension", title: "Reading Comprehension", description: "Reading comprehension training game", keywords: ["reading", "comprehension", "literacy"] },
  { path: "/dyslexia-reading-training", title: "Dyslexia Reading Training", description: "Dyslexia-friendly reading training tools", keywords: ["dyslexia", "reading", "training", "phonics"] },
  { path: "/progress", title: "Progress", description: "Track your breathing and wellbeing progress", keywords: ["progress", "tracking", "stats", "history"] },
  { path: "/rewards", title: "Rewards", description: "Badges, streaks, and achievement rewards", keywords: ["rewards", "badges", "streaks", "achievements"] },
  { path: "/send-report", title: "SEND Report", description: "Generate SEND (Special Educational Needs) reports", keywords: ["send", "report", "sen", "special needs", "assessment"] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(path: string): string {
  return path
    .replace(/^\//, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9-]/gi, "")
    || "home";
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "NeuroBreath-Indexer/1.0" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      console.warn(`  ⚠ ${url} → ${res.status}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.warn(`  ⚠ ${url} → ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

function extractContent(html: string): { text: string; headings: string[] } {
  const $ = cheerio.load(html);

  // Remove nav, footer, scripts, styles, hidden elements
  $("nav, footer, script, style, noscript, [aria-hidden='true'], .sr-only").remove();

  const headings: string[] = [];
  $("h1, h2, h3").each((_, el) => {
    const t = $(el).text().trim();
    if (t) headings.push(t);
  });

  // Get main content area, fall back to body
  const main = $("main").length ? $("main") : $("body");
  const text = main
    .text()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 30_000); // Cap at 30k chars per page

  return { text, headings };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // Init Firebase Admin
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    console.error("❌ FIREBASE_SERVICE_ACCOUNT_KEY not set");
    process.exit(1);
  }

  const existing = getApps();
  const app = existing.length
    ? existing[0]
    : initializeApp({ credential: cert(JSON.parse(raw)) });
  const db = getFirestore(app);

  console.log(`🔍 Indexing ${PAGES_TO_INDEX.length} pages from ${BASE_URL}\n`);

  let indexed = 0;
  let navWritten = 0;

  for (const page of PAGES_TO_INDEX) {
    const url = `${BASE_URL}${page.path}`;
    const docId = slugify(page.path);

    process.stdout.write(`  ${page.path} ... `);

    const html = await fetchPage(url);
    if (!html) {
      console.log("SKIPPED");
      continue;
    }

    const { text, headings } = extractContent(html);

    // Write siteContentChunks doc
    await db.collection("siteContentChunks").doc(docId).set({
      url: page.path,
      title: page.title,
      content: text,
      headings,
      indexedAt: new Date().toISOString(),
      rawLength: html.length,
    });
    indexed++;

    // Write siteNavigation doc
    await db.collection("siteNavigation").doc(docId).set({
      path: page.path,
      title: page.title,
      description: page.description,
      keywords: page.keywords,
      ...(page.parent ? { parent: page.parent } : {}),
    });
    navWritten++;

    console.log(`OK (${text.length} chars, ${headings.length} headings)`);
  }

  // Write a metadata doc for last indexing run
  await db.collection("siteContentChunks").doc("_meta").set({
    lastRunAt: FieldValue.serverTimestamp(),
    baseUrl: BASE_URL,
    pagesAttempted: PAGES_TO_INDEX.length,
    pagesIndexed: indexed,
  });

  console.log(`\n✅ Done: ${indexed} pages indexed, ${navWritten} nav entries written`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
