import { Controller, Get, Query, Req } from '@nestjs/common';
import { AnimalService } from '../services/animal.service';
import { AnimalResponse } from '../interfaces/animal.interface';
import { Public } from '../../shared/decorators/public.decorator';
import type { RequestWithUser } from '../../shared/interfaces/request-with-user';
import { PaginationDTO } from 'src/shared/dto/pagination.dto';
import { PaginationResult } from '../interfaces/pagination.result';

@Controller('animals')
export class AnimalController {
  constructor(private animalService: AnimalService) {}

  @Public()
  @Get('/')
  async getAllAnimals(
    @Query() paginationDto: PaginationDTO,
  ): Promise<PaginationResult<AnimalResponse[]>> {
    return this.animalService.findAllAnimals(
      paginationDto.limit,
      paginationDto.skip,
    );
  }

  @Get('/user')
  async getUserAnimals(
    @Req() request: RequestWithUser,
    @Query() paginationDto: PaginationDTO,
  ): Promise<PaginationResult<AnimalResponse[]>> {
    const userId = request.user.sub;
    return await this.animalService.findAnimalsByUser(
      userId,
      paginationDto.limit,
      paginationDto.skip,
    );
  }
}
