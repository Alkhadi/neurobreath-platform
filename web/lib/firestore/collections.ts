/**
 * Firestore collection name constants.
 *
 * Centralised here so every server module references the same strings.
 */

export const COLLECTIONS = {
  SITE_CONTENT_CHUNKS: "siteContentChunks",
  SITE_NAVIGATION: "siteNavigation",
  USERS: "users",
  SUPPORTERS: "supporters",
  /** Sub-collection under users/{uid} */
  CHAT_SESSIONS: "chatSessions",
} as const;
