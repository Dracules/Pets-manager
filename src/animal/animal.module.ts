import { Module } from '@nestjs/common';
import { AnimalController } from './controllers/animal.controller';
import { AnimalService } from './services/animal.service';
import { CatModule } from '../cats/cat.module';
import { DogModule } from '../dogs/dog.module';

@Module({
  imports: [CatModule, DogModule],
  controllers: [AnimalController],
  providers: [AnimalService],
})
export class AnimalModule {}
