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
} from '@nestjs/common';
import { CatService } from '../services/cat.service';
import { type Response } from 'express';
import { AnimalExceptionFilter } from '../../animal/exception_filters/animal.http.exception.filter';
import { Roles } from '../../shared/decorators/roles.decorator';
import { AnimalCacheInterceptor } from 'src/animal/interceptors/animal.cache.interceptor';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { CatDTO } from '../dto/cat.dto';

@Controller('animals/cats')
export class CatController {
  constructor(private catService: CatService) {}

  @Get('/')
  async getCats(): Promise<CatDTO[]> {
    return await this.catService.findAll();
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
  @Roles(['admin', 'user'])
  async createCat(
    @Body()
    catDTO: CatDTO,
    @Res() response: Response,
  ): Promise<void> {
    const cat = await this.catService.create(catDTO);
    response.json(cat);
  }

  @Put('/:id')
  @Roles(['admin', 'user'])
  @UseFilters(AnimalExceptionFilter)
  async updateCat(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() catDTO: Partial<CatDTO>,
    @Res() response: Response,
  ): Promise<void> {
    const cat = await this.catService.updateById(id, catDTO);
    response.json(cat);
  }

  @Delete('/:id')
  @Roles(['admin', 'user'])
  @UseFilters(AnimalExceptionFilter)
  async deleteCat(
    @Param('id', ParseObjectIdPipe) id: string,
    @Res() response: Response,
  ): Promise<void> {
    const cat = await this.catService.delete(id);
    response.json(cat);
  }
}
