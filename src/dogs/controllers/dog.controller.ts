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

@Controller('animals/dogs')
export class DogController {
  constructor(private dogService: DogService) {}

  @Public()
  @Get('/')
  async getDogs(): Promise<DogDTO[]> {
    return await this.dogService.findAll();
  }

  @Get('/user')
  async getDogByUser(@Req() request: RequestWithUser): Promise<DogDTO[]> {
    const userId = request.user.sub;
    return await this.dogService.findByUser(userId);
  }

  @Get('/:id')
  @UseFilters(AnimalExceptionFilter)
  @UseInterceptors(AnimalCacheInterceptor)
  async getDogById(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<DogDTO> {
    return await this.dogService.findById(id);
  }

  @Post('/')
  async createDog(
    @Body()
    dogDTO: DogDTO,
    @Res() response: Response,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    const userId = request.user.sub;
    const dog = await this.dogService.create(dogDTO, userId);
    response.json(dog);
  }

  @Put('/:id')
  @UseFilters(AnimalExceptionFilter)
  async updateDog(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dogDTO: UpdateDogDTO,
    @Res() response: Response,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    const userId = request.user.sub;
    const dog = await this.dogService.updateById(userId, id, dogDTO);
    response.json(dog);
  }

  @Delete('/:id')
  @UseFilters(AnimalExceptionFilter)
  async deleteDog(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() response: Response,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    const userId = request.user.sub;
    const message = await this.dogService.delete(userId, id);
    response.json(message);
  }
}
