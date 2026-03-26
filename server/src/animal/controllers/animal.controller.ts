import { Controller, Get } from '@nestjs/common';
import { AnimalService } from '../services/animal.service';
import { AnimalResponse } from '../interfaces/animal.interface';
import { Public } from '../../shared/decorators/public.decorator';

@Controller('animals')
export class AnimalController {
  constructor(private animalService: AnimalService) {}

  @Public()
  @Get('/')
  async getAllAnimals(): Promise<AnimalResponse[]> {
    return this.animalService.findAllAnimals();
  }
}
