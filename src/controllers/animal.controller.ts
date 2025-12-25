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
import { AnimalService } from '../services/animal.service';
import { type Response } from 'express';
import { AnimalDTO } from '../dto/animal.dto';
import { AnimalExceptionFilter } from '../exception_filters/animal.http.exception.filter';
import { Roles } from '../decorators/roles.decorator';
import { CatCacheInterceptor } from 'src/interseptors/cat.cache.interceptor';

@Controller('animals')
export class AnimalController {
  constructor(private animalService: AnimalService) {}

  @Get('cat')
  async getCats(): Promise<AnimalDTO[]> {
    return await this.animalService.findAll_DB();
  }

  @Get('cat/:id')
  @UseFilters(AnimalExceptionFilter)
  @UseInterceptors(CatCacheInterceptor)
  async getCatById(@Param('id', ParseIntPipe) id: number): Promise<AnimalDTO> {
    return await this.animalService.findById_DB(id);
  }

  @Post('cat')
  @Roles(['admin', 'user'])
  async createCat(
    @Body() catDTO: AnimalDTO,
    @Res() response: Response,
  ): Promise<void> {
    const cat = await this.animalService.create_DB(catDTO);
    response.json(cat);
  }

  @Get('admin')
  @Roles(['admin'])
  getAdmin(): string {
    return 'Hello, Admin!';
  }
}
