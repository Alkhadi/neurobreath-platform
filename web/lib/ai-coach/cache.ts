import type { AICoachResponse, CacheEntry } from '@/types/ai-coach'

const cache = new Map<string, CacheEntry>()
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

export function getCached(queryKey: string): AICoachResponse | null {
  const entry = cache.get(queryKey)
  
  if (!entry) return null
  
  const age = Date.now() - entry.timestamp
  
  if (age > CACHE_TTL) {
    cache.delete(queryKey)
    return null
  }
  
  return entry.data
}

export function setCached(queryKey: string, data: AICoachResponse): void {
  cache.set(queryKey, {
    data,
    timestamp: Date.now()
  })
  
  // Cleanup old entries if cache gets too large
  if (cache.size > 100) {
    const oldestKey = Array.from(cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0]
    cache.delete(oldestKey)
  }
}

export function generateQueryKey(question: string, topic?: string, audience?: string): string {
  const normalized = question.toLowerCase().trim()
  return `${normalized}:${topic || 'general'}:${audience || 'all'}`
}
