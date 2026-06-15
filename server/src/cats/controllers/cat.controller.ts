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
import { CatResponse } from '../interfaces/cat.interface';
import { AnimalCacheService } from '../../animal/services/animal.cache.service';
import { PaginationResult } from '../../animal/interfaces/pagination.result';
import { PaginationDTO } from '../../shared/dto/pagination.dto';

@Controller('animals/cats')
export class CatController extends BaseAnimalController<CatDTO, CatResponse> {
  constructor(catService: CatService, cache: AnimalCacheService) {
    super(catService, cache);
  }

  @Public()
  @Get('/')
  async getCats(
    @Query() paginationDto: PaginationDTO,
  ): Promise<PaginationResult<CatResponse[]>> {
    return await super.getAnimals(paginationDto.limit, paginationDto.skip);
  }

  @Get('/user')
  async getCatByUser(
    @Req() request: RequestWithUser,
    @Query() paginationDto: PaginationDTO,
  ): Promise<PaginationResult<CatResponse[]>> {
    return await super.getAnimalByUser(
      request.user.sub,
      paginationDto.limit,
      paginationDto.skip,
    );
  }

  @Get('/user/:id')
  async getCatBySelectedUser(
    @Param('id', ParseObjectIdPipe) id: string,
    @Query() paginationDto: PaginationDTO,
  ): Promise<PaginationResult<CatResponse[]>> {
    return await super.getAnimalByUser(
      id,
      paginationDto.limit,
      paginationDto.skip,
    );
  }

  @Get('/:id')
  @UseFilters(AnimalExceptionFilter)
  @UseInterceptors(AnimalCacheInterceptor)
  async getCatById(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<CatResponse> {
    return await super.getAnimalById(id);
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
