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
  /** Sub-collection under users/{uid}/chatSessions/{sessionId} */
  MESSAGES: "messages",
  /** Sub-collection under users/{uid} */
  PROGRESS: "progress",
  /** Sub-collection under users/{uid} */
  SAVED_CARDS: "savedCards",
  /** Sub-collection under users/{uid} */
  PAGE_SAVES: "pageSaves",
} as const;
