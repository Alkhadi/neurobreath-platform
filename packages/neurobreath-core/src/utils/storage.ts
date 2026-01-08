/**
 * Storage Abstraction
 * 
 * Works with localStorage, AsyncStorage, or any key-value store
 */

export interface StorageAdapter {
  getItem(key: string): string | null | Promise<string | null>
  setItem(key: string, value: string): void | Promise<void>
  removeItem(key: string): void | Promise<void>
}

export class Storage {
  constructor(
    private adapter: StorageAdapter,
    private prefix: string = 'app'
  ) {}
  
  private getKey(key: string): string {
    return `${this.prefix}:${key}`
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await this.adapter.getItem(this.getKey(key))
      if (!raw) return null
      return JSON.parse(raw) as T
    } catch (error) {
      console.error('[Storage] Get error:', error)
      return null
    }
  }
  
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const raw = JSON.stringify(value)
      await this.adapter.setItem(this.getKey(key), raw)
    } catch (error) {
      console.error('[Storage] Set error:', error)
    }
  }
  
  async remove(key: string): Promise<void> {
    try {
      await this.adapter.removeItem(this.getKey(key))
    } catch (error) {
      console.error('[Storage] Remove error:', error)
    }
  }
}

/**
 * Create storage instance with localStorage (browser)
 */
export function createBrowserStorage(prefix: string = 'app'): Storage {
  if (typeof window === 'undefined') {
    throw new Error('Browser storage requires window object')
  }
  
  return new Storage(window.localStorage, prefix)
}

/**
 * Create storage instance with custom adapter
 */
export function createStorage(adapter: StorageAdapter, prefix: string = 'app'): Storage {
  return new Storage(adapter, prefix)
}

