import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Param,
  UseFilters,
  ParseIntPipe,
} from '@nestjs/common';
import { AnimalService } from './animal.service';
import { Cat } from './interfaces/cat.interface';
import { type Response } from 'express';
import { AnimalDTO } from './dto/animal.dto';
import { AnimalExceptionFilter } from './exception_filters/animal.http.exception.filter';

@Controller('animals')
export class AnimalController {
  constructor(private animalService: AnimalService) {}

  @Get('cat')
  async getCat(): Promise<Cat[]> {
    return this.animalService.getAll();
  }

  @Get('cat/:id')
  @UseFilters(new AnimalExceptionFilter())
  async getCatById(@Param('id', ParseIntPipe) id: number): Promise<Cat> {
    return this.animalService.getById(id);
  }

  @Post('cat')
  getCats(@Body() catDTO: AnimalDTO, @Res() response: Response): void {
    this.animalService.create(catDTO);
    response.json(catDTO);
  }
}
