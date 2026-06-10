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
import { ParrotService } from '../services/parrot.service';
import { type Response } from 'express';
import { AnimalExceptionFilter } from '../../animal/exception_filters/animal.http.exception.filter';
import { AnimalCacheInterceptor } from '../../animal/interceptors/animal.cache.interceptor';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { ParrotDTO, UpdateParrotDTO } from '../dto/parrot.dto';
import { Public } from '../../shared/decorators/public.decorator';
import type { RequestWithUser } from '../../shared/interfaces/request-with-user';
import { BaseAnimalController } from '../../animal/controllers/base.animal.controller';
import { ParrotResponse } from '../interfaces/parrot.interface';
import { AnimalCacheService } from '../../animal/services/animal.cache.service';
import { PaginationResult } from '../../animal/interfaces/pagination.result';
import { PaginationDTO } from '../../shared/dto/pagination.dto';

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
    @Query() paginationDto: PaginationDTO,
  ): Promise<PaginationResult<ParrotResponse[]>> {
    return await super.getAnimals(paginationDto.limit, paginationDto.skip);
  }

  @Get('/user')
  async getParrotByUser(
    @Req() request: RequestWithUser,
    @Query() paginationDto: PaginationDTO,
  ): Promise<PaginationResult<ParrotResponse[]>> {
    return await super.getAnimalByUser(
      request.user.sub,
      paginationDto.limit,
      paginationDto.skip,
    );
  }

  @Get('/user/:id')
  async getParrotBySelectedUser(
    @Param('id', ParseObjectIdPipe) id: string,
    @Query() paginationDto: PaginationDTO,
  ): Promise<PaginationResult<ParrotResponse[]>> {
    return await super.getAnimalByUser(
      id,
      paginationDto.limit,
      paginationDto.skip,
    );
  }

  @Get('/:id')
  @UseFilters(AnimalExceptionFilter)
  @UseInterceptors(AnimalCacheInterceptor)
  async getParrotById(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<ParrotResponse> {
    return await super.getAnimalById(id);
  }

  @Post('/')
  async createParrot(
    @Body()
    parrotDTO: ParrotDTO,
    @Res() response: Response,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    return await super.createAnimal(parrotDTO, response, request);
  }

  @Put('/:id')
  @UseFilters(AnimalExceptionFilter)
  async updateParrot(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() parrotDTO: UpdateParrotDTO,
    @Res() response: Response,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    if (parrotDTO.vocabulary && parrotDTO.vocabulary.length === 0) {
      parrotDTO.vocabulary = undefined;
      return await super.updateAnimal(id, parrotDTO, response, request, {
        $unset: { vocabulary: '' },
      });
    }
    return await super.updateAnimal(id, parrotDTO, response, request);
  }

  @Delete('/:id')
  @UseFilters(AnimalExceptionFilter)
  async deleteParrot(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() response: Response,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    return await super.deleteAnimal(id, response, request);
  }
}
