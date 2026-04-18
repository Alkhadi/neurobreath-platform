/**
 * Content Indexer — crawls the public neurobreath.co.uk site and writes
 * page content chunks + navigation entries to Firestore.
 *
 * Usage:
 *   cd web && npx tsx scripts/index-site-content.ts
 *
 * Requires env vars:
 *   FIREBASE_SERVICE_ACCOUNT_KEY (or FIREBASE_ADMIN_* individual vars)
 *   SITE_INDEX_BASE_URL            (default: https://neurobreath.co.uk)
 *   OPENAI_API_KEY                 (for embedding generation)
 *
 * This script is idempotent — re-running overwrites existing docs.
 */

import * as cheerio from "cheerio";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import OpenAI from "openai";

// ─── Config ──────────────────────────────────────────────────────────────────

const BASE_URL = process.env.SITE_INDEX_BASE_URL || "https://neurobreath.co.uk";
const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
const MAX_CHUNK_LENGTH = 1500;

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
  { path: "/conditions", title: "Conditions Hub", description: "Browse all neurodivergent conditions supported by NeuroBreath", keywords: ["conditions", "neurodivergent", "support", "all conditions"] },
  { path: "/conditions/depression", title: "Depression Support", description: "Evidence-based depression support, breathing techniques, and wellbeing tools", keywords: ["depression", "low mood", "mood", "mental health", "depression support"] },
  { path: "/conditions/bipolar", title: "Bipolar Support", description: "Bipolar disorder support, mood regulation tools, and breathing techniques", keywords: ["bipolar", "bipolar disorder", "mood swings", "mania", "bipolar support"] },
  { path: "/conditions/anxiety", title: "Anxiety Support", description: "Anxiety management with breathing techniques and coping tools", keywords: ["anxiety", "worry", "panic", "anxiety support", "anxious"] },
  { path: "/conditions/autism", title: "Autism Support", description: "Autism-friendly breathing and sensory regulation tools", keywords: ["autism", "asd", "autistic", "sensory", "autism support"] },
  { path: "/conditions/dyslexia", title: "Dyslexia Support", description: "Dyslexia-friendly reading and learning support tools", keywords: ["dyslexia", "reading", "literacy", "dyslexia support"] },
  { path: "/conditions/ptsd", title: "PTSD Support", description: "PTSD and trauma support with evidence-based breathing techniques", keywords: ["ptsd", "trauma", "post-traumatic", "ptsd support"] },
  { path: "/conditions/tourette", title: "Tourette Support", description: "Tourette syndrome support and breathing-based tic management tools", keywords: ["tourette", "tics", "tourette syndrome", "tourette support"] },
  { path: "/conditions/dyspraxia", title: "Dyspraxia Support", description: "Dyspraxia and motor coordination support tools", keywords: ["dyspraxia", "dcd", "motor coordination", "dyspraxia support"] },
  { path: "/conditions/dyscalculia", title: "Dyscalculia Support", description: "Dyscalculia and maths difficulty support", keywords: ["dyscalculia", "maths", "numeracy", "dyscalculia support"] },
  { path: "/conditions/dysgraphia", title: "Dysgraphia Support", description: "Dysgraphia and writing difficulty support", keywords: ["dysgraphia", "writing", "handwriting", "dysgraphia support"] },
  { path: "/conditions/sensory-processing", title: "Sensory Processing Support", description: "Sensory processing disorder support and regulation tools", keywords: ["sensory processing", "spd", "sensory", "sensory support"] },
  { path: "/conditions/auditory-processing", title: "Auditory Processing Support", description: "Auditory processing disorder support tools", keywords: ["auditory processing", "apd", "hearing", "auditory support"] },
  { path: "/conditions/visual-processing", title: "Visual Processing Support", description: "Visual processing difficulty support", keywords: ["visual processing", "visual", "vision", "visual support"] },
  { path: "/conditions/visual-stress", title: "Visual Stress Support", description: "Visual stress and Irlen syndrome support", keywords: ["visual stress", "irlen", "reading difficulty", "visual stress support"] },
  { path: "/conditions/executive-function", title: "Executive Function Support", description: "Executive function difficulty support and planning tools", keywords: ["executive function", "planning", "organisation", "executive support"] },
  { path: "/conditions/hyperlexia", title: "Hyperlexia Support", description: "Hyperlexia information and support", keywords: ["hyperlexia", "reading", "hyperlexia support"] },
  { path: "/conditions/slcn", title: "SLCN Support", description: "Speech, language and communication needs support", keywords: ["slcn", "speech", "language", "communication", "slcn support"] },
  { path: "/conditions/mood", title: "Mood Support", description: "Mood management and emotional wellbeing tools", keywords: ["mood", "emotions", "mood support", "emotional wellbeing"] },
  { path: "/conditions/low-mood-burnout", title: "Low Mood & Burnout Support", description: "Low mood and burnout recovery support tools", keywords: ["low mood", "burnout", "exhaustion", "burnout support"] },
  { path: "/conditions/sleep", title: "Sleep Conditions Support", description: "Sleep-related condition support and tools", keywords: ["sleep condition", "insomnia", "sleep disorder", "sleep support"] },
  { path: "/conditions/stress", title: "Stress Conditions Support", description: "Stress-related condition support and management tools", keywords: ["stress condition", "chronic stress", "stress support"] },
  { path: "/conditions/adhd-parent", title: "ADHD Parent Support", description: "ADHD support and strategies for parents", keywords: ["adhd parent", "parent support", "adhd family"] },
  { path: "/conditions/adhd-teacher", title: "ADHD Teacher Support", description: "ADHD classroom strategies and teacher resources", keywords: ["adhd teacher", "classroom adhd", "teacher support"] },
  { path: "/conditions/adhd-carer", title: "ADHD Carer Support", description: "ADHD support for carers and professionals", keywords: ["adhd carer", "carer support"] },
  { path: "/conditions/autism-parent", title: "Autism Parent Support", description: "Autism support and strategies for parents", keywords: ["autism parent", "parent support", "autism family"] },
  { path: "/conditions/autism-teacher", title: "Autism Teacher Support", description: "Autism classroom strategies and teacher resources", keywords: ["autism teacher", "classroom autism", "teacher support"] },
  { path: "/conditions/autism-carer", title: "Autism Carer Support", description: "Autism support for carers and professionals", keywords: ["autism carer", "carer support"] },
  { path: "/conditions/anxiety-parent", title: "Anxiety Parent Support", description: "Anxiety support and strategies for parents", keywords: ["anxiety parent", "parent support", "anxiety family"] },
  { path: "/conditions/anxiety-carer", title: "Anxiety Carer Support", description: "Anxiety support for carers and professionals", keywords: ["anxiety carer", "carer support"] },
  { path: "/conditions/dyslexia-parent", title: "Dyslexia Parent Support", description: "Dyslexia support and strategies for parents", keywords: ["dyslexia parent", "parent support", "dyslexia family"] },
  { path: "/conditions/dyslexia-teacher", title: "Dyslexia Teacher Support", description: "Dyslexia classroom strategies and teacher resources", keywords: ["dyslexia teacher", "classroom dyslexia", "teacher support"] },
  { path: "/conditions/dyslexia-carer", title: "Dyslexia Carer Support", description: "Dyslexia support for carers and professionals", keywords: ["dyslexia carer", "carer support"] },
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

function chunkText(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = start + maxLen;
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf(". ", end);
      if (lastPeriod > start + maxLen / 2) end = lastPeriod + 1;
    }
    const slice = text.slice(start, end).trim();
    if (slice) chunks.push(slice);
    start = end;
  }
  return chunks;
}

function buildAliases(path: string, title: string): string[] {
  const aliases: string[] = [];
  const segments = path.split("/").filter((s) => s && s !== "uk" && s !== "us");
  for (const seg of segments) {
    aliases.push(seg.replace(/-/g, " "));
  }
  const titleLower = title.toLowerCase();
  if (!aliases.includes(titleLower)) aliases.push(titleLower);
  return aliases;
}

async function generateEmbedding(openai: OpenAI, text: string): Promise<number[]> {
  const resp = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text.slice(0, 8000),
  });
  return resp.data[0]?.embedding ?? [];
}

// ─── Firebase Admin init (supports both credential modes) ────────────────────

function initAdmin() {
  const existing = getApps();
  if (existing.length > 0) return getFirestore(existing[0]);

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (raw) {
    const app = initializeApp({ credential: cert(JSON.parse(raw)) });
    return getFirestore(app);
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (projectId && clientEmail && privateKey) {
    const app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey: privateKey.replace(/\\n/g, "\n") }),
    });
    return getFirestore(app);
  }

  console.error("❌ No Firebase credentials found. Set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_ADMIN_* vars");
  process.exit(1);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const db = initAdmin();

  const apiKey = process.env.OPENAI_API_KEY;
  const openai = apiKey ? new OpenAI({ apiKey }) : null;

  if (!openai) {
    console.warn("⚠ OPENAI_API_KEY not set — indexing without embeddings (keyword search only)");
  }

  console.log(`🔍 Indexing ${PAGES_TO_INDEX.length} pages from ${BASE_URL}\n`);

  let indexed = 0;
  let navWritten = 0;
  let totalChunks = 0;

  for (const page of PAGES_TO_INDEX) {
    const url = `${BASE_URL}${page.path}`;
    const navDocId = slugify(page.path);

    process.stdout.write(`  ${page.path} ... `);

    const html = await fetchPage(url);
    if (!html) {
      console.log("SKIPPED");
      continue;
    }

    const { text, headings } = extractContent(html);

    // Write siteNavigation doc with aliases and published flag
    await db.collection("siteNavigation").doc(navDocId).set({
      path: page.path,
      title: page.title,
      url: page.path,
      description: page.description,
      keywords: page.keywords,
      aliases: buildAliases(page.path, page.title),
      published: true,
      ...(page.parent ? { parent: page.parent } : {}),
      updatedAt: FieldValue.serverTimestamp(),
    });
    navWritten++;

    // Chunk content and write siteContentChunks docs
    const chunks = chunkText(text, MAX_CHUNK_LENGTH);
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      let embedding: number[] = [];

      if (openai) {
        try {
          embedding = await generateEmbedding(openai, `${page.title} ${chunk}`);
        } catch (err) {
          console.warn(`\n    ⚠ Embedding failed for chunk ${i + 1}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }

      const chunkDocId = chunks.length === 1 ? navDocId : `${navDocId}-${i}`;
      await db.collection("siteContentChunks").doc(chunkDocId).set({
        url: page.path,
        title: page.title,
        content: chunk,
        headings,
        keywords: page.keywords,
        embedding,
        published: true,
        chunkIndex: i,
        updatedAt: FieldValue.serverTimestamp(),
      });
      totalChunks++;
    }

    indexed++;
    console.log(`OK (${text.length} chars, ${headings.length} headings, ${chunks.length} chunk(s))`);
  }

  // Write a metadata doc for last indexing run
  await db.collection("siteContentChunks").doc("_meta").set({
    lastRunAt: FieldValue.serverTimestamp(),
    baseUrl: BASE_URL,
    pagesAttempted: PAGES_TO_INDEX.length,
    pagesIndexed: indexed,
    totalChunks,
    embeddingsEnabled: !!openai,
  });

  console.log(`\n✅ Done: ${indexed} pages indexed, ${totalChunks} chunks, ${navWritten} nav entries`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
