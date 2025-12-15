import { Controller, Get, Param } from '@nestjs/common';

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
}
