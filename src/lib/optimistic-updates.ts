import { List } from '@/types/list';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface OptimisticUpdate<T> {
  id: string;
  operation: 'create' | 'update' | 'delete';
  data?: T;
  rollback: () => void;
}

export class OptimisticUpdateManager<T extends { id: string }> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private pendingUpdates: Map<string, OptimisticUpdate<T>> = new Map();
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes

  constructor(private onError: (error: Error) => void) {}

  // Get data from cache
  getCached(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if cache is still valid
    if (Date.now() - entry.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  // Update cache with new data
  updateCache(key: string, data: T) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  // Handle optimistic update
  async optimisticUpdate<R>(
    key: string,
    operation: 'create' | 'update' | 'delete',
    updateFn: () => Promise<R>,
    optimisticData?: T,
    rollbackFn?: () => void
  ): Promise<R> {
    // Store original data for rollback
    const originalData = this.getCached(key);

    // Apply optimistic update
    if (optimisticData) {
      this.updateCache(key, optimisticData);
    }

    try {
      // Perform actual update
      const result = await updateFn();
      
      // Update cache with real data
      if (result && typeof result === 'object' && 'id' in result) {
        this.updateCache(key, result as unknown as T);
      }

      return result;
    } catch (error) {
      // Rollback on error
      if (originalData) {
        this.updateCache(key, originalData);
      } else {
        this.cache.delete(key);
      }

      if (rollbackFn) {
        rollbackFn();
      }

      this.onError(error instanceof Error ? error : new Error('Update failed'));
      throw error;
    }
  }

  // Clear expired cache entries
  clearExpiredCache() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
      }
    }
  }

  // Clear all cache
  clearCache() {
    this.cache.clear();
    this.pendingUpdates.clear();
  }
}

// Create a singleton instance for lists
export const listUpdateManager = new OptimisticUpdateManager<List>(
  (error) => console.error('List update failed:', error)
);