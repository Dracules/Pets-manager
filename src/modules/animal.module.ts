import { Module } from '@nestjs/common';
import { AnimalController } from '../controllers/animal.controller';
import { AnimalService } from '../services/animal.service';
import { CatCacheService } from 'src/services/cat.cache.service';

@Module({
  controllers: [AnimalController],
  providers: [AnimalService, CatCacheService],
})
export class AnimalModule {}
