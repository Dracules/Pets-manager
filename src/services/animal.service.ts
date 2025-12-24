import { Injectable } from '@nestjs/common';
import { Cat } from '../interfaces/cat.interface';
import { AnimalException } from '../exception_filters/exceptions/animal.exception';
import { AnimalDTO } from '../dto/animal.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cat } from 'src/schemas/cat.schema';
import { Model } from 'mongoose';

@Injectable()
export class AnimalService {
  constructor(@InjectModel(Cat.name) private catModel: Model<Cat>) {}

  private readonly cats: Cat[] = [
    { id: 0, name: 'cat', age: 3 },
    { id: 1, name: 'catty', age: 6 },
  ];

  create(catDTO: AnimalDTO) {
    const cat: Cat = {
      id: this.cats.length > 0 ? this.cats[length - 1].id + 1 : 0,
      ...catDTO,
    };
    this.cats.push(cat);
  }

  getAll(): Cat[] {
    return this.cats;
  }

  getById(id: number): Cat {
    const cat = this.cats.find((cat) => cat.id === id);
    if (!cat || id < 0) throw new AnimalException();
    return cat;
  }
}
