import { Module } from '@nestjs/common';
import { AnimalController } from './controllers/animal.controller';

import { CatModule } from '../cats/cat.module';
import { DogModule } from '../dogs/dog.module';

@Module({
  imports: [CatModule, DogModule],
  controllers: [AnimalController],
})
export class AnimalModule {}
