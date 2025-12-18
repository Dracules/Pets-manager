import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';
import { AnimalException } from './exception_filters/exceptions/animal.exception';

@Injectable()
export class AnimalService {
  private readonly cats: Cat[] = [
    { name: 'cat', age: 3 },
    { name: 'catty', age: 6 },
  ];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  getAll(): Cat[] {
    return this.cats;
  }

  getById(id: number): Cat {
    if (id >= this.cats.length || id < 0) throw new AnimalException();
    return this.cats[id];
  }
}
