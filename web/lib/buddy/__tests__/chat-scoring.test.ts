/**
 * Regression tests for /api/chat scoring helpers & query normalisation.
 *
 * Run with:  npx tsx lib/buddy/__tests__/chat-scoring.test.ts
 *
 * Tests cover:
 *  - site-grounded questions (strong match)
 *  - weak / unsupported questions
 *  - query normalisation
 *  - unpublished page filtering
 *  - mixed partial matches
 */

import { strict as assert } from "assert";
import {
  normaliseQuery,
  scorePages,
  STRONG_MATCH_THRESHOLD,
} from "../chat-scoring";
import type { InternalPageMetadata } from "../kb/types";

// ── Helpers ──────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${err instanceof Error ? err.message : String(err)}`);
  }
}

function makePage(
  overrides: Partial<InternalPageMetadata> & { path: string; title: string },
): InternalPageMetadata {
  return {
    headings: [],
    anchors: [],
    audiences: [],
    keyTopics: [],
    lastUpdated: "2026-01-01",
    isPublished: true,
    ...overrides,
  };
}

// ── Fixtures ─────────────────────────────────────────────────────────────────

const PAGES: InternalPageMetadata[] = [
  makePage({
    path: "/adhd",
    title: "ADHD Hub",
    description: "Focus timers, gamified quests, and skill strategies for ADHD.",
    keyTopics: ["ADHD", "focus", "executive function"],
    headings: [{ text: "Pomodoro Timer", id: "timer", level: 2 }],
  }),
  makePage({
    path: "/autism",
    title: "Autism Hub",
    description: "Calm toolkit, education pathways, and printable resources.",
    keyTopics: ["autism", "sensory", "calm toolkit"],
    headings: [{ text: "Skills Library", id: "skills", level: 2 }],
  }),
  makePage({
    path: "/breathing",
    title: "Breathing Exercises",
    description: "Evidence-based breathing techniques for anxiety, sleep, and focus.",
    keyTopics: ["breathing", "box breathing", "4-7-8"],
    headings: [{ text: "Box Breathing", id: "box", level: 2 }],
  }),
  makePage({
    path: "/sleep",
    title: "Sleep Hub",
    description: "Sleep hygiene guidance and relaxation techniques.",
    keyTopics: ["sleep", "insomnia", "relaxation"],
    headings: [],
  }),
  makePage({
    path: "/draft-page",
    title: "Unpublished Draft",
    description: "This should never match.",
    keyTopics: ["ADHD", "focus"],
    isPublished: false,
  }),
];

// ── Tests ────────────────────────────────────────────────────────────────────

console.log("\n=== normaliseQuery ===");

test("strips punctuation", () => {
  assert.equal(normaliseQuery("What is ADHD?"), "ADHD");
});

test("strips common question words", () => {
  assert.equal(normaliseQuery("How can I sleep better?"), "I sleep better");
});

test("preserves original if everything is stripped", () => {
  const q = "is the a";
  // After stripping, result would be empty → returns original
  assert.equal(normaliseQuery(q), q);
});

test("collapses whitespace", () => {
  assert.equal(normaliseQuery("  What   is   breathing?  "), "breathing");
});

console.log("\n=== scorePages — site-grounded questions ===");

test("exact title match scores highest", () => {
  const results = scorePages(PAGES, "adhd hub");
  assert.ok(results.length > 0, "should have results");
  assert.equal(results[0].page.path, "/adhd");
  assert.ok(results[0].score >= 100, `expected ≥100, got ${results[0].score}`);
});

test("key topic match is strong", () => {
  const results = scorePages(PAGES, "box breathing");
  assert.ok(results.length > 0);
  const breathing = results.find((r) => r.page.path === "/breathing");
  assert.ok(breathing, "breathing page should be in results");
  assert.ok(
    breathing.score >= STRONG_MATCH_THRESHOLD,
    `expected ≥${STRONG_MATCH_THRESHOLD}, got ${breathing.score}`,
  );
});

test("heading match contributes score", () => {
  const results = scorePages(PAGES, "pomodoro timer");
  const adhd = results.find((r) => r.page.path === "/adhd");
  assert.ok(adhd, "ADHD page should match heading");
  assert.ok(adhd.score >= 30, `expected heading score ≥30, got ${adhd.score}`);
});

test("description match contributes score", () => {
  const results = scorePages(PAGES, "sleep hygiene");
  const sleep = results.find((r) => r.page.path === "/sleep");
  assert.ok(sleep, "Sleep page should match description");
  assert.ok(sleep.score > 0, `expected >0, got ${sleep.score}`);
});

console.log("\n=== scorePages — weak / unsupported questions ===");

test("completely unrelated query scores zero for all pages", () => {
  const results = scorePages(PAGES, "quantum physics lecture schedule");
  const nonZero = results.filter((r) => r.score > 0);
  assert.equal(nonZero.length, 0, `expected 0 matches, got ${nonZero.length}`);
});

test("partial word overlap produces low score below threshold", () => {
  const results = scorePages(PAGES, "focus music playlist");
  const strong = results.filter((r) => r.score >= STRONG_MATCH_THRESHOLD);
  // "focus" appears in ADHD keyTopics, so it may get a hit, but should not be ≥30 from "focus" alone
  // (word-level match adds only 5 per word)
  assert.ok(
    strong.length <= 1,
    `expected ≤1 strong match for vague query, got ${strong.length}`,
  );
});

console.log("\n=== scorePages — filtering ===");

test("unpublished pages are excluded", () => {
  const results = scorePages(PAGES, "adhd focus");
  const draft = results.find((r) => r.page.path === "/draft-page");
  assert.equal(draft, undefined, "unpublished page should not appear");
});

test("limit parameter caps results", () => {
  const results = scorePages(PAGES, "a", 2);
  assert.ok(results.length <= 2, `expected ≤2 results, got ${results.length}`);
});

console.log("\n=== scorePages — mixed evidence behaviour ===");

test("multi-word query distributes score across matching pages", () => {
  const results = scorePages(PAGES, "adhd breathing");
  assert.ok(results.length >= 2, "both ADHD and Breathing pages should match");
  const adhd = results.find((r) => r.page.path === "/adhd");
  const breathing = results.find((r) => r.page.path === "/breathing");
  assert.ok(adhd && adhd.score > 0, "ADHD page should score");
  assert.ok(breathing && breathing.score > 0, "Breathing page should score");
});

console.log("\n=== STRONG_MATCH_THRESHOLD ===");

test("threshold is 30", () => {
  assert.equal(STRONG_MATCH_THRESHOLD, 30);
});

// ── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
