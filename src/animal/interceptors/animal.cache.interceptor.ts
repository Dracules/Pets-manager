import { Injectable } from '@nestjs/common';
import { Animal } from '../../animal/interfaces/animal.interface';
import { CacheInterceptor } from '../../shared/interseptors/cache.interceptor';
import { AnimalCacheService } from '../../animal/services/animal.cache.service';

@Injectable()
export class AnimalCacheInterceptor extends CacheInterceptor<Animal> {
  constructor(cache: AnimalCacheService) {
    super(cache);
  }
}
