import { Module } from '@nestjs/common';
import { AnimalController } from './controllers/animal.controller';

import { CatModule } from '../cats/cat.module';
import { DogModule } from '../dogs/dog.module';
import { AnimalService } from './services/animal.service';
import { ParrotModule } from '../parrots/parrot.module';

@Module({
  imports: [CatModule, DogModule, ParrotModule],
  controllers: [AnimalController],
  providers: [AnimalService],
})
export class AnimalModule {}
