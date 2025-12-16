import { Controller, Get, Post, Body, Res, Param } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { Cat } from './interfaces/cat.interface';
import { type Response } from 'express';
import { AnimalDTO } from './dto/animal.dto';

@Controller('animals')
export class AnimalController {
  constructor(private animalService: AnimalService) {}

  @Get('cat')
  async getCat(): Promise<Cat[]> {
    return this.animalService.getAll();
  }

  @Get('cat/:id')
  async getCatById(@Param('id') id: number): Promise<Cat> {
    return this.animalService.getById(id);
  }

  @Post('cat')
  getCats(@Body() catDTO: AnimalDTO, @Res() response: Response): void {
    //response.send('Your good animal!');
    const catty = { name: catDTO.name, age: catDTO.age };
    this.animalService.create(catty);
    response.json(catty);
  }
}
