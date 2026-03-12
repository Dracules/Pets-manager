import { Module } from '@nestjs/common';
import { CatController } from './controllers/cat.controller';
import { CatService } from './services/cat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from './schemas/cat.schema';
import { AnimalCacheService } from '../animal/services/animal.cache.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
  controllers: [CatController],
  providers: [CatService, AnimalCacheService],
})
export class CatModule {}
