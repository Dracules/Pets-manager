import { Controller, Get, Post, Body, Res, Param } from '@nestjs/common';
import { AnimalService } from './animal.service';

class AnimalDTO {
  name: string = 'cattinho';
  age: number = 10;
}

@Controller('animals')
export class AnimalController {
  constructor(private animalService: AnimalService) {}

  @Get('cat')
  async getCat(): Promise<object> {
    return this.animalService.getAll();
  }

  @Get('cat/:id')
  async getCatById(@Param('id') id: number): Promise<object> {
    return this.animalService.getById(id);
  }

  @Post('cat')
  getCats(@Body() catDTO: AnimalDTO, @Res() response): void {
    //response.send('Your good animal!');
    const catty = { name: catDTO.name, age: catDTO.age };
    this.animalService.create(catty);
    response.json(catty);
  }
}
