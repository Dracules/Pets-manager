import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from '../services/cache.service';
import { Request } from 'express';
import { Document } from 'mongoose';

@Injectable()
export class CacheInterceptor<T> implements NestInterceptor<T, T> {
  constructor(private readonly cache: CacheService<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const key = request.url;

    const cached = this.cache.getFromCache(key);
    if (cached) {
      console.log(`Take cache with url=${key}`);
      return of(cached);
    }

    return next.handle().pipe(
      tap((item: T) => {
        if (item) {
          const plain = isMongooseDoc(item) ? item.toJSON() : item;
          this.cache.saveToCache(key, plain);
        }
      }),
    );
  }
}

function isMongooseDoc(doc: any): doc is Document {
  const b = !!doc && typeof doc.toObject === 'function';
  return b;
}
