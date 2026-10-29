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
import { CatService } from '../services/cat.service';
import { type Response } from 'express';
import { AnimalExceptionFilter } from '../../animal/exception_filters/animal.http.exception.filter';
import { AnimalCacheInterceptor } from '../../animal/interceptors/animal.cache.interceptor';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { CatDTO, UpdateCatDTO } from '../dto/cat.dto';
import { Public } from '../../shared/decorators/public.decorator';
import type { RequestWithUser } from '../../shared/interfaces/request-with-user';
import { BaseAnimalController } from '../../animal/controllers/base.animal.controller';
import type { CatResponse } from '../interfaces/cat.interface';
import { AnimalCacheService } from '../../animal/services/animal.cache.service';
import type { PaginationResult } from '../../animal/interfaces/pagination.result';
import { QueryParamsDTO } from '../../shared/dto/query.params.dto';

@Controller('animals/cats')
export class CatController extends BaseAnimalController<CatDTO, CatResponse> {
  constructor(catService: CatService, cache: AnimalCacheService) {
    super(catService, cache);
  }

  @Public()
  @Get('/')
  async getCats(
    @Query() queryParamsDTO: QueryParamsDTO,
  ): Promise<PaginationResult<CatResponse[]>> {
    return await super.getAnimals(
      queryParamsDTO.limit,
      queryParamsDTO.skip,
      queryParamsDTO.sortBy,
      queryParamsDTO.sortOrder,
    );
  }

  @Get('/user')
  async getCatByUser(
    @Req() request: RequestWithUser,
    @Query() queryParamsDTO: QueryParamsDTO,
  ): Promise<PaginationResult<CatResponse[]>> {
    return await super.getAnimalByUser(
      request.user.sub,
      queryParamsDTO.limit,
      queryParamsDTO.skip,
      queryParamsDTO.sortBy,
      queryParamsDTO.sortOrder,
    );
  }

  @Get('/user/:id')
  async getCatBySelectedUser(
    @Param('id', ParseObjectIdPipe) id: string,
    @Query() queryParamsDTO: QueryParamsDTO,
  ): Promise<PaginationResult<CatResponse[]>> {
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
  async getCatById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Req() request: RequestWithUser,
  ): Promise<CatResponse> {
    return await super.getAnimalById(id, request.user.sub);
  }

  @Post('/')
  async createCat(
    @Body()
    catDTO: CatDTO,
    @Res() response: Response,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    return await super.createAnimal(catDTO, response, request);
  }

  @Put('/:id')
  @UseFilters(AnimalExceptionFilter)
  async updateCat(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() catDTO: UpdateCatDTO,
    @Res() response: Response,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    return await super.updateAnimal(id, catDTO, response, request);
  }

  @Delete('/:id')
  @UseFilters(AnimalExceptionFilter)
  async deleteCat(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() response: Response,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    return await super.deleteAnimal(id, response, request);
  }
}
