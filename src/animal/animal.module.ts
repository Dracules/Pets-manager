import { Module } from '@nestjs/common';
import { AnimalController } from './controllers/animal.controller';
import { AnimalService } from './services/animal.service';
import { AnimalCacheService } from 'src/animal/services/animal.cache.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from 'src/cats/schemas/cat.schema';
import { CatModule } from 'src/cats/cat.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
    CatModule,
  ],
  controllers: [AnimalController],
  providers: [AnimalService, AnimalCacheService],
})
export class AnimalModule {}
