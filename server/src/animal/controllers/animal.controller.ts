import { Controller, Get, Req } from '@nestjs/common';
import { AnimalService } from '../services/animal.service';
import { AnimalResponse } from '../interfaces/animal.interface';
import { Public } from '../../shared/decorators/public.decorator';
import type { RequestWithUser } from '../../shared/interfaces/request-with-user';

@Controller('animals')
export class AnimalController {
  constructor(private animalService: AnimalService) {}

  @Public()
  @Get('/')
  async getAllAnimals(): Promise<AnimalResponse[]> {
    return this.animalService.findAllAnimals();
  }

  @Get('/user')
  async getUserAnimals(
    @Req() request: RequestWithUser,
  ): Promise<AnimalResponse[]> {
    const userId = request.user.sub;
    return await this.animalService.findAnimalsByUser(userId);
  }
}
