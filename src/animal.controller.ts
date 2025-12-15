import { Controller, Get, Post, Body, Res, Param } from '@nestjs/common';

class AnimalDTO {
  name: string = 'cattinho';
  age: number = 10;
}

const animals: object[] = [
  { name: 'cat', age: 3 },
  { name: 'catty', age: 6 },
];

@Controller('animals')
export class AnimalController {
  constructor() {}

  @Get('cat')
  async getCat(): Promise<object> {
    return animals;
  }

  @Get('cat/:id')
  async getCatById(@Param('id') id: number): Promise<object> {
    return animals[id];
  }

  @Post('cat')
  getCats(@Body() catDTO: AnimalDTO, @Res() response): void {
    //response.send('Your good animal!');
    const catty = { name: catDTO.name, age: catDTO.age };
    animals.push(catty);
    response.json(catty);
  }
}
