import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Param,
  UseFilters,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { CatService } from '../services/cat.service';
import { type Response } from 'express';
import { AnimalDTO } from '../../animal/dto/animal.dto';
import { AnimalExceptionFilter } from '../../animal/exception_filters/animal.http.exception.filter';
import { Roles } from '../../shared/decorators/roles.decorator';
import { AnimalCacheInterceptor } from 'src/animal/interceptors/animal.cache.interceptor';

@Controller('animals/cats')
export class CatController {
  constructor(private catService: CatService) {}

  @Get('/')
  async getCats(): Promise<AnimalDTO[]> {
    return await this.catService.findAll_DB();
  }

  @Get('/:id')
  @UseFilters(AnimalExceptionFilter)
  @UseInterceptors(AnimalCacheInterceptor)
  async getCatById(@Param('id', ParseIntPipe) id: number): Promise<AnimalDTO> {
    return await this.catService.findById_DB(id);
  }

  @Post('/')
  @Roles(['admin', 'user'])
  async createCat(
    @Body() catDTO: AnimalDTO,
    @Res() response: Response,
  ): Promise<void> {
    const cat = await this.catService.create_DB(catDTO);
    response.json(cat);
  }

  @Put('/:id')
  @Roles(['admin', 'user'])
  @UseFilters(AnimalExceptionFilter)
  async updateCat(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() catDTO: Partial<AnimalDTO>,
    @Res() response: Response,
  ): Promise<void> {
    const cat = await this.catService.updateById_DB(id, catDTO);
    response.json(cat);
  }
}
