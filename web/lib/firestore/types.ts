/**
 * Firestore collection types for Phase 1.
 *
 * Collections:
 *   siteContentChunks   — indexed page content for RAG context
 *   siteNavigation      — deterministic route table for navigation intents
 *   users/{uid}/chatSessions — user chat history
 *   supporters          — Stripe-synced supporter status
 */

import type { FieldValue } from "firebase-admin/firestore";

// ─── siteContentChunks ──────────────────────────────────────────────────────

export interface SiteContentChunk {
  /** Unique doc id: slugified url path, e.g. "adhd" or "breathing-techniques-sos-60" */
  url: string;
  title: string;
  /** Plain-text content for RAG embedding / keyword search */
  content: string;
  /** H2/H3 headings extracted from the page */
  headings: string[];
  /** ISO 8601 */
  indexedAt: string;
  /** Byte length of raw HTML before extraction */
  rawLength: number;
}

// ─── siteNavigation ─────────────────────────────────────────────────────────

export interface SiteNavigationEntry {
  /** Relative path, e.g. "/adhd" */
  path: string;
  title: string;
  /** Short description shown in Buddy navigation responses */
  description: string;
  /** Keywords / aliases for fuzzy matching */
  keywords: string[];
  /** Parent path for breadcrumb context */
  parent?: string;
}

// ─── users/{uid}/chatSessions ───────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  /** ISO 8601 */
  timestamp: string;
}

export interface ChatSession {
  /** Auto-generated doc id */
  messages: ChatMessage[];
  /** First user message, for listing sessions */
  title: string;
  createdAt: string | FieldValue;
  updatedAt: string | FieldValue;
  /** Page context when session started */
  pathname?: string;
}

// ─── supporters ─────────────────────────────────────────────────────────────

export interface Supporter {
  /** Firebase UID */
  uid: string;
  /** Stripe customer ID */
  stripeCustomerId: string;
  /** Email from Stripe (not PII stored by us — comes from Stripe events) */
  email?: string;
  status: "active" | "cancelled" | "past_due";
  /** Stripe plan / price info */
  planId?: string;
  /** ISO 8601 */
  activatedAt: string | FieldValue;
  cancelledAt?: string | FieldValue;
}
