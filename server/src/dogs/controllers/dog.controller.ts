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
import { DogResponse } from '../interfaces/dog.interface';
import { AnimalCacheService } from '../../animal/services/animal.cache.service';
import { PaginationResult } from 'src/animal/interfaces/pagination.result';
import { PaginationDTO } from 'src/shared/dto/pagination.dto';

@Controller('animals/dogs')
export class DogController extends BaseAnimalController<DogDTO, DogResponse> {
  constructor(dogService: DogService, cache: AnimalCacheService) {
    super(dogService, cache);
  }

  @Public()
  @Get('/')
  async getDogs(
    @Query() paginationDto: PaginationDTO,
  ): Promise<PaginationResult<DogResponse[]>> {
    return await super.getAnimals(paginationDto.limit, paginationDto.skip);
  }

  @Get('/user')
  async getDogByUser(
    @Req() request: RequestWithUser,
    @Query() paginationDto: PaginationDTO,
  ): Promise<PaginationResult<DogResponse[]>> {
    return await super.getAnimalByUser(
      request,
      paginationDto.limit,
      paginationDto.skip,
    );
  }

  @Get('/:id')
  @UseFilters(AnimalExceptionFilter)
  @UseInterceptors(AnimalCacheInterceptor)
  async getDogById(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<DogResponse> {
    return await super.getAnimalById(id);
  }

  @Post('/')
  async createDog(
    @Body()
    dogDTO: DogDTO,
    @Res() response: Response,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    return await super.createAnimal(dogDTO, response, request);
  }

  @Put('/:id')
  @UseFilters(AnimalExceptionFilter)
  async updateDog(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dogDTO: UpdateDogDTO,
    @Res() response: Response,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    if (dogDTO.trainedCommands && dogDTO.trainedCommands.length === 0) {
      dogDTO.trainedCommands = undefined;
      return await super.updateAnimal(id, dogDTO, response, request, {
        $unset: { trainedCommands: '' },
      });
    }
    return await super.updateAnimal(id, dogDTO, response, request);
  }

  @Delete('/:id')
  @UseFilters(AnimalExceptionFilter)
  async deleteDog(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() response: Response,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    return await super.deleteAnimal(id, response, request);
  }
}
