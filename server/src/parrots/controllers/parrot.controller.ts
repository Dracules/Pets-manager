import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseFilters,
  UseInterceptors,
  Patch,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { ParrotService } from '../services/parrot.service';
import { AnimalExceptionFilter } from '../../animal/exception_filters/animal.http.exception.filter';
import { AnimalCacheInterceptor } from '../../animal/interceptors/animal.cache.interceptor';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { ParrotDTO, UpdateParrotDTO } from '../dto/parrot.dto';
import { Public } from '../../shared/decorators/public.decorator';
import type { RequestWithUser } from '../../shared/interfaces/request-with-user';
import { BaseAnimalController } from '../../animal/controllers/base.animal.controller';
import type { ParrotResponse } from '../interfaces/parrot.interface';
import { AnimalCacheService } from '../../animal/services/animal.cache.service';
import type { PaginationResult } from '../../animal/interfaces/pagination.result';
import { QueryParamsDTO } from '../../shared/dto/query.params.dto';

@Controller('animals/parrots')
export class ParrotController extends BaseAnimalController<
  ParrotDTO,
  ParrotResponse
> {
  constructor(parrotService: ParrotService, cache: AnimalCacheService) {
    super(parrotService, cache);
  }

  @Public()
  @Get('/')
  async getParrots(
    @Query() queryParamsDTO: QueryParamsDTO,
  ): Promise<PaginationResult<ParrotResponse[]>> {
    return await super.getAnimals(
      queryParamsDTO.limit,
      queryParamsDTO.skip,
      queryParamsDTO.sortBy,
      queryParamsDTO.sortOrder,
    );
  }

  @Get('/user')
  async getParrotByUser(
    @Req() request: RequestWithUser,
    @Query() queryParamsDTO: QueryParamsDTO,
  ): Promise<PaginationResult<ParrotResponse[]>> {
    return await super.getAnimalByUser(
      request.user.sub,
      queryParamsDTO.limit,
      queryParamsDTO.skip,
      queryParamsDTO.sortBy,
      queryParamsDTO.sortOrder,
    );
  }

  @Get('/user/:id')
  async getParrotBySelectedUser(
    @Param('id', ParseObjectIdPipe) id: string,
    @Query() queryParamsDTO: QueryParamsDTO,
  ): Promise<PaginationResult<ParrotResponse[]>> {
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
  async getParrotById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Req() request: RequestWithUser,
  ): Promise<ParrotResponse> {
    return await super.getAnimalById(id, request.user.sub);
  }

  @Post('/')
  async createParrot(
    @Body()
    parrotDTO: ParrotDTO,
    @Req() request: RequestWithUser,
  ): Promise<ParrotResponse> {
    return await super.createAnimal(parrotDTO, request.user.sub);
  }

  @Patch('/:id')
  @UseFilters(AnimalExceptionFilter)
  async updateParrot(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() parrotDTO: UpdateParrotDTO,
    @Req() request: RequestWithUser,
  ): Promise<ParrotResponse> {
    return await super.updateAnimal(
      id,
      request.user.sub,
      parrotDTO,
      request.url,
    );
  }

  @Delete('/:id')
  @UseFilters(AnimalExceptionFilter)
  async deleteParrot(
    @Param('id', ParseObjectIdPipe) id: string,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    return await super.deleteAnimal(id, request.user.sub);
  }
}
