import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from '../services/cache.service';

export class CacheInterceptor<T> implements NestInterceptor<T, T> {
  constructor(private readonly cache: CacheService<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const id = Number(request.params.id);

    const cached = this.cache.getFromCache(id);
    if (cached) {
      return of(cached);
    }

    return next.handle().pipe(
      tap((item: T) => {
        if (item) {
          this.cache.saveToCache(id, item);
        }
      }),
    );
  }
}
