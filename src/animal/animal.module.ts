import { Module } from '@nestjs/common';
import { AnimalController } from './controllers/animal.controller';
import { AnimalService } from './services/animal.service';
import { CatCacheService } from 'src/animal/services/cat.cache.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from 'src/animal/schemas/cat.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
  controllers: [AnimalController],
  providers: [AnimalService, CatCacheService],
})
export class AnimalModule {}
