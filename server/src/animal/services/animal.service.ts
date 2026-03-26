import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat, CatDocument } from 'src/cats/schemas/cat.schema';
import { AnimalResponse } from '../interfaces/animal.interface';

@Injectable()
export class AnimalService {
  constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>) {}

  async findAllAnimals(): Promise<AnimalResponse[]> {
    const animals = await this.catModel
      .aggregate([
        { $addFields: { type: 'cat' } },
        {
          $unionWith: {
            coll: 'dogs',
            pipeline: [{ $addFields: { type: 'dog' } }],
          },
        },
      ])
      .exec();
    return animals as AnimalResponse[];
  }
}
