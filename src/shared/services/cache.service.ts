import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService<T> {
  private readonly cache = new Map<string, T>();

  getFromCache(url: string): T | undefined {
    return this.cache.get(url);
  }

  saveToCache(url: string, item: T): void {
    console.log(`Put cache with url=${url}`);
    this.cache.set(url, item);
  }
}
