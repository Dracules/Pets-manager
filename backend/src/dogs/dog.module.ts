import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Dog, DogSchema } from './schemas/dog.schema';
import { DogController } from './controllers/dog.controller';
import { DogService } from './services/dog.service';
import { AnimalCacheService } from '../animal/services/animal.cache.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Dog.name, schema: DogSchema }])],
  controllers: [DogController],
  providers: [DogService, AnimalCacheService],
})
export class DogModule {}
