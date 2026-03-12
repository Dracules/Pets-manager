import { Injectable } from '@nestjs/common';
import { AnimalResponse } from '../interfaces/animal.interface';
import { CacheInterceptor } from '../../shared/interseptors/cache.interceptor';
import { AnimalCacheService } from '../services/animal.cache.service';

@Injectable()
export class AnimalCacheInterceptor extends CacheInterceptor<AnimalResponse> {
  constructor(cache: AnimalCacheService) {
    super(cache);
  }
}
