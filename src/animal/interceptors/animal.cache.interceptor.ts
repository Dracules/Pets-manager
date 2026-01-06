import { Injectable } from '@nestjs/common';
import { Animal } from 'src/animal/interfaces/animal.interface';
import { CacheInterceptor } from 'src/shared/interseptors/cache.interceptor';
import { AnimalCacheService } from 'src/animal/services/animal.cache.service';

@Injectable()
export class AnimalCacheInterceptor extends CacheInterceptor<Animal> {
  constructor(cache: AnimalCacheService) {
    super(cache);
  }
}
