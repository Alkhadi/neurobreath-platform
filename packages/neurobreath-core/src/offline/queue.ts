/**
 * Offline Queue Management
 * 
 * Queue operations when offline, sync when online
 */

import type { Storage } from '../utils/storage'

export interface QueueItem {
  id: string
  type: 'session' | 'assessment' | 'badge'
  data: any
  timestamp: string
  retries: number
}

export class OfflineQueue {
  private queue: QueueItem[] = []
  private readonly QUEUE_KEY = 'offline-queue'
  
  constructor(private storage: Storage) {
    this.load()
  }
  
  private async load() {
    const stored = await this.storage.get<QueueItem[]>(this.QUEUE_KEY)
    if (stored) {
      this.queue = stored
    }
  }
  
  private async save() {
    await this.storage.set(this.QUEUE_KEY, this.queue)
  }
  
  async add(type: QueueItem['type'], data: any): Promise<void> {
    const item: QueueItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: new Date().toISOString(),
      retries: 0
    }
    
    this.queue.push(item)
    await this.save()
  }
  
  async getAll(): Promise<QueueItem[]> {
    return [...this.queue]
  }
  
  async remove(id: string): Promise<void> {
    this.queue = this.queue.filter(item => item.id !== id)
    await this.save()
  }
  
  async incrementRetry(id: string): Promise<void> {
    const item = this.queue.find(i => i.id === id)
    if (item) {
      item.retries++
      await this.save()
    }
  }
  
  async clear(): Promise<void> {
    this.queue = []
    await this.save()
  }
  
  get size(): number {
    return this.queue.length
  }
}

