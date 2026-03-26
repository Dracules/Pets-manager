import { Module } from '@nestjs/common';
import { AnimalController } from './controllers/animal.controller';

import { CatModule } from '../cats/cat.module';
import { DogModule } from '../dogs/dog.module';
import { AnimalService } from './services/animal.service';

@Module({
  imports: [CatModule, DogModule],
  controllers: [AnimalController],
  providers: [AnimalService],
})
export class AnimalModule {}
