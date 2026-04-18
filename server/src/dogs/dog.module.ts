import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Dog, DogSchema } from './schemas/dog.schema';
import { DogController } from './controllers/dog.controller';
import { DogService } from './services/dog.service';
import { AnimalCacheModule } from '../animal/controllers/animal.cache.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dog.name, schema: DogSchema }]),
    AnimalCacheModule,
  ],
  controllers: [DogController],
  providers: [DogService],
  exports: [MongooseModule],
})
export class DogModule {}
