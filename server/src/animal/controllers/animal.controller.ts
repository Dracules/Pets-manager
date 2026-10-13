import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { AnimalService } from '../services/animal.service';
import type { AnimalResponse } from '../interfaces/animal.interface';
import { Public } from '../../shared/decorators/public.decorator';
import type { RequestWithUser } from '../../shared/interfaces/request-with-user';
import { PaginationDTO } from '../../shared/dto/pagination.dto';
import type { PaginationResult } from '../interfaces/pagination.result';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

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

  @Get('/user/:id')
  async getSelectedUserAnimals(
    @Param('id', ParseObjectIdPipe) id: string,
    @Query() paginationDto: PaginationDTO,
  ): Promise<PaginationResult<AnimalResponse[]>> {
    return await this.animalService.findAnimalsByUser(
      id,
      paginationDto.limit,
      paginationDto.skip,
    );
  }
}
