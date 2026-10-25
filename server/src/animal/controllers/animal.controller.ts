import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { AnimalService } from '../services/animal.service';
import type { AnimalResponse } from '../interfaces/animal.interface';
import { Public } from '../../shared/decorators/public.decorator';
import type { RequestWithUser } from '../../shared/interfaces/request-with-user';
import { QueryParamsDTO } from '../../shared/dto/query.params.dto';
import type { PaginationResult } from '../interfaces/pagination.result';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('animals')
export class AnimalController {
  constructor(private animalService: AnimalService) {}

  @Public()
  @Get('/')
  async getAllAnimals(
    @Query() queryParamsDTO: QueryParamsDTO,
  ): Promise<PaginationResult<AnimalResponse[]>> {
    return this.animalService.findAllAnimals(
      queryParamsDTO.limit,
      queryParamsDTO.skip,
      queryParamsDTO.sortBy,
      queryParamsDTO.sortOrder,
    );
  }

  @Get('/user')
  async getUserAnimals(
    @Req() request: RequestWithUser,
    @Query() queryParamsDTO: QueryParamsDTO,
  ): Promise<PaginationResult<AnimalResponse[]>> {
    const userId = request.user.sub;
    return await this.animalService.findAnimalsByUser(
      userId,
      queryParamsDTO.limit,
      queryParamsDTO.skip,
      queryParamsDTO.sortBy,
      queryParamsDTO.sortOrder,
    );
  }

  @Get('/user/:id')
  async getSelectedUserAnimals(
    @Param('id', ParseObjectIdPipe) id: string,
    @Query() queryParamsDTO: QueryParamsDTO,
  ): Promise<PaginationResult<AnimalResponse[]>> {
    return await this.animalService.findAnimalsByUser(
      id,
      queryParamsDTO.limit,
      queryParamsDTO.skip,
      queryParamsDTO.sortBy,
      queryParamsDTO.sortOrder,
    );
  }
}
