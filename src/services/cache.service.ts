export class CacheService<T> {
  private readonly cache = new Map<number, T>();

  getFromCache(id: number): T | undefined {
    return this.cache.get(id);
  }

  saveToCache(id: number, item: T): void {
    this.cache.set(id, item);
  }
}
