import { Controller, Get } from '@nestjs/common';

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
}
