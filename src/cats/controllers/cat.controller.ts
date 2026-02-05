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
import { CatService } from '../services/cat.service';
import { type Response } from 'express';
import { AnimalExceptionFilter } from '../../animal/exception_filters/animal.http.exception.filter';
import { AnimalCacheInterceptor } from '../../animal/interceptors/animal.cache.interceptor';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { CatDTO, UpdateCatDTO } from '../dto/cat.dto';
import { Public } from '../../shared/decorators/public.decorator';
import type { RequestWithUser } from 'src/shared/interfaces/request-with-user';

@Controller('animals/cats')
export class CatController {
  constructor(private catService: CatService) {}

  @Public()
  @Get('/')
  async getCats(): Promise<CatDTO[]> {
    return await this.catService.findAll();
  }

  @Get('/user')
  async getCatByUser(@Req() request: RequestWithUser): Promise<CatDTO[]> {
    const userId = request.user.sub;
    return await this.catService.findByUser(userId);
  }

  @Get('/:id')
  @UseFilters(AnimalExceptionFilter)
  @UseInterceptors(AnimalCacheInterceptor)
  async getCatById(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<CatDTO> {
    return await this.catService.findById(id);
  }

  @Post('/')
  async createCat(
    @Body()
    catDTO: CatDTO,
    @Res() response: Response,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    const userId = request.user.sub;
    const cat = await this.catService.create(catDTO, userId);
    response.json(cat);
  }

  @Put('/:id')
  @UseFilters(AnimalExceptionFilter)
  async updateCat(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() catDTO: UpdateCatDTO,
    @Res() response: Response,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    const userId = request.user.sub;
    const cat = await this.catService.updateById(userId, id, catDTO);
    response.json(cat);
  }

  @Delete('/:id')
  @UseFilters(AnimalExceptionFilter)
  async deleteCat(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() response: Response,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    const userId = request.user.sub;
    const message = await this.catService.delete(userId, id);
    response.json(message);
  }
}
