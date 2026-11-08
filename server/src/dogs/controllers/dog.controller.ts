import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Param,
  UseFilters,
  UseInterceptors,
  Put,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { DogService } from '../services/dog.service';
import { type Response } from 'express';
import { AnimalExceptionFilter } from '../../animal/exception_filters/animal.http.exception.filter';
import { AnimalCacheInterceptor } from '../../animal/interceptors/animal.cache.interceptor';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { DogDTO, UpdateDogDTO } from '../dto/dog.dto';
import { Public } from '../../shared/decorators/public.decorator';
import type { RequestWithUser } from '../../shared/interfaces/request-with-user';
import { BaseAnimalController } from '../../animal/controllers/base.animal.controller';
import type { DogResponse } from '../interfaces/dog.interface';
import { AnimalCacheService } from '../../animal/services/animal.cache.service';
import type { PaginationResult } from '../../animal/interfaces/pagination.result';
import { QueryParamsDTO } from '../../shared/dto/query.params.dto';

@Controller('animals/dogs')
export class DogController extends BaseAnimalController<DogDTO, DogResponse> {
  constructor(dogService: DogService, cache: AnimalCacheService) {
    super(dogService, cache);
  }

  @Public()
  @Get('/')
  async getDogs(
    @Query() queryParamsDTO: QueryParamsDTO,
  ): Promise<PaginationResult<DogResponse[]>> {
    return await super.getAnimals(
      queryParamsDTO.limit,
      queryParamsDTO.skip,
      queryParamsDTO.sortBy,
      queryParamsDTO.sortOrder,
    );
  }

  @Get('/user')
  async getDogByUser(
    @Req() request: RequestWithUser,
    @Query() queryParamsDTO: QueryParamsDTO,
  ): Promise<PaginationResult<DogResponse[]>> {
    return await super.getAnimalByUser(
      request.user.sub,
      queryParamsDTO.limit,
      queryParamsDTO.skip,
      queryParamsDTO.sortBy,
      queryParamsDTO.sortOrder,
    );
  }

  @Get('/user/:id')
  async getDogBySelectedUser(
    @Param('id', ParseObjectIdPipe) id: string,
    @Query() queryParamsDTO: QueryParamsDTO,
  ): Promise<PaginationResult<DogResponse[]>> {
    return await super.getAnimalByUser(
      id,
      queryParamsDTO.limit,
      queryParamsDTO.skip,
      queryParamsDTO.sortBy,
      queryParamsDTO.sortOrder,
    );
  }

  @Get('/:id')
  @UseFilters(AnimalExceptionFilter)
  @UseInterceptors(AnimalCacheInterceptor)
  async getDogById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Req() request: RequestWithUser,
  ): Promise<DogResponse> {
    return await super.getAnimalById(id, request.user.sub);
  }

  @Post('/')
  async createDog(
    @Body()
    dogDTO: DogDTO,
    @Req() request: RequestWithUser,
  ): Promise<DogResponse> {
    return await super.createAnimal(dogDTO, request.user.sub);
  }

  @Put('/:id')
  @UseFilters(AnimalExceptionFilter)
  async updateDog(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dogDTO: UpdateDogDTO,
    @Req() request: RequestWithUser,
  ): Promise<DogResponse> {
    if (dogDTO.trainedCommands && dogDTO.trainedCommands.length === 0) {
      dogDTO.trainedCommands = undefined;
      return await super.updateAnimal(
        id,
        request.user.sub,
        dogDTO,
        request.url,
        {
          $unset: { trainedCommands: '' },
        },
      );
    }
    return await super.updateAnimal(id, request.user.sub, dogDTO, request.url);
  }

  @Delete('/:id')
  @UseFilters(AnimalExceptionFilter)
  async deleteDog(
    @Param('id', ParseObjectIdPipe) id: string,
    @Req() request: RequestWithUser,
  ): Promise<string> {
    return await super.deleteAnimal(id, request.user.sub);
  }
}
