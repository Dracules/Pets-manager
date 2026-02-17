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

@Controller('animals/dogs')
export class DogController extends BaseAnimalController<DogDTO> {
  constructor(private dogService: DogService) {
    super(dogService);
  }

  @Public()
  @Get('/')
  async getDogs(): Promise<DogDTO[]> {
    return await super.getAnimals();
  }

  @Get('/user')
  async getDogByUser(@Req() request: RequestWithUser): Promise<DogDTO[]> {
    return await super.getAnimalByUser(request);
  }

  @Get('/:id')
  @UseFilters(AnimalExceptionFilter)
  @UseInterceptors(AnimalCacheInterceptor)
  async getDogById(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<DogDTO> {
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
