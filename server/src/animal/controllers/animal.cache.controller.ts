import { Module } from '@nestjs/common';
import { AnimalCacheService } from '../services/animal.cache.service';

@Module({
  providers: [AnimalCacheService],
  exports: [AnimalCacheService],
})
export class AnimalCacheModule {}
