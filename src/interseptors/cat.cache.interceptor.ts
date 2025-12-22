import { Injectable } from '@nestjs/common';
import { Cat } from 'src/interfaces/cat.interface';
import { CacheInterceptor } from 'src/interseptors/cache.interceptor';
import { CatCacheService } from 'src/services/cat.cache.service';

@Injectable()
export class CatCacheInterceptor extends CacheInterceptor<Cat> {
  constructor(cache: CatCacheService) {
    super(cache);
  }
}
