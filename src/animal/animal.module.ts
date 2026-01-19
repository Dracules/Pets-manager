import { Module } from '@nestjs/common';
import { AnimalController } from './controllers/animal.controller';
import { AnimalService } from './services/animal.service';
import { CatModule } from '../cats/cat.module';

@Module({
  imports: [CatModule],
  controllers: [AnimalController],
  providers: [AnimalService],
})
export class AnimalModule {}
