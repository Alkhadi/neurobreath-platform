// Simple rate limiter for PubMed API (3 requests per second)
class RateLimiter {
  private queue: Array<() => void> = []
  private processing = false
  private readonly interval: number
  private readonly maxPerInterval: number
  private requestCount = 0
  private lastReset = Date.now()

  constructor(maxPerInterval: number = 3, intervalMs: number = 1000) {
    this.maxPerInterval = maxPerInterval
    this.interval = intervalMs
  }

  async throttle<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      
      this.processQueue()
    })
  }

  private processQueue(): void {
    if (this.processing || this.queue.length === 0) return
    
    this.processing = true
    this.executeNext()
  }

  private executeNext(): void {
    const now = Date.now()
    
    // Reset counter if interval has passed
    if (now - this.lastReset >= this.interval) {
      this.requestCount = 0
      this.lastReset = now
    }
    
    // Check if we can execute
    if (this.requestCount < this.maxPerInterval && this.queue.length > 0) {
      const task = this.queue.shift()
      this.requestCount++
      
      if (task) {
        task()
      }
      
      // Schedule next execution
      if (this.queue.length > 0) {
        setTimeout(() => this.executeNext(), 0)
      } else {
        this.processing = false
      }
    } else {
      // Wait until interval resets
      const waitTime = this.interval - (now - this.lastReset)
      setTimeout(() => {
        this.requestCount = 0
        this.lastReset = Date.now()
        this.executeNext()
      }, waitTime)
    }
  }
}

export const pubmedRateLimiter = new RateLimiter(3, 1000)


