/**
 * Firestore-backed chat history — save and retrieve Buddy conversations.
 *
 * Data model:
 *   users/{uid}/chatSessions/{sessionId}          — session metadata
 *   users/{uid}/chatSessions/{sessionId}/messages  — individual messages
 */

import { FieldValue, type Firestore } from "firebase-admin/firestore";
import { COLLECTIONS } from "@/lib/firestore/collections";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ─── Session management ──────────────────────────────────────────────────────

/**
 * Ensure a chat session document exists. Creates one if sessionId is not
 * provided; returns the resolved session ID.
 */
export async function ensureSession(
  db: Firestore,
  uid: string,
  sessionId: string | undefined,
  title?: string,
): Promise<string> {
  const sessionsRef = db
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .collection(COLLECTIONS.CHAT_SESSIONS);

  if (sessionId) {
    const existing = await sessionsRef.doc(sessionId).get();
    if (existing.exists) return sessionId;
  }

  // Create a new session
  const newRef = sessionsRef.doc();
  await newRef.set({
    title: (title ?? "Chat").slice(0, 120),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return newRef.id;
}

// ─── Message persistence ─────────────────────────────────────────────────────

/**
 * Append a single message to a chat session's messages sub-collection.
 */
export async function saveMessageToSession(
  db: Firestore,
  uid: string,
  sessionId: string,
  message: ChatMessage,
): Promise<string> {
  const msgRef = db
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .collection(COLLECTIONS.CHAT_SESSIONS)
    .doc(sessionId)
    .collection(COLLECTIONS.MESSAGES)
    .doc();

  await msgRef.set({
    role: message.role,
    content: message.content,
    metadata: message.metadata ?? null,
    createdAt: message.createdAt,
  });

  // Touch session updatedAt
  await db
    .collection(COLLECTIONS.USERS)
    .doc(uid)
    .collection(COLLECTIONS.CHAT_SESSIONS)
    .doc(sessionId)
    .update({ updatedAt: FieldValue.serverTimestamp() });

  return msgRef.id;
}

/**
 * Save both user and assistant turns in one call (convenience wrapper).
 */
export async function saveTurnPair(
  db: Firestore,
  uid: string,
  sessionId: string,
  userContent: string,
  assistantContent: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const now = new Date().toISOString();

  await saveMessageToSession(db, uid, sessionId, {
    role: "user",
    content: userContent,
    createdAt: now,
  });

  await saveMessageToSession(db, uid, sessionId, {
    role: "assistant",
    content: assistantContent,
    metadata,
    createdAt: now,
  });
}
