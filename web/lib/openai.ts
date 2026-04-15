/**
 * OpenAI client — lazy initialisation for server-side use only.
 *
 * Returns null when OPENAI_API_KEY is not configured, allowing the app
 * to run without AI in local/dev mode.
 */

import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  if (_client) return _client;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  _client = new OpenAI({ apiKey });
  return _client;
}
