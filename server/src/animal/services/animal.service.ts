import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cat, CatDocument } from '../../cats/schemas/cat.schema';
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

  async findAnimalsByUser(userId: string): Promise<AnimalResponse[]> {
    const userObjectId = new Types.ObjectId(userId);
    const animals = await this.catModel
      .aggregate([
        { $match: { owner: userObjectId } },
        { $addFields: { type: 'cat' } },
        {
          $unionWith: {
            coll: 'dogs',
            pipeline: [
              { $match: { owner: userObjectId } },
              { $addFields: { type: 'dog' } },
            ],
          },
        },
      ])
      .exec();
    return animals as AnimalResponse[];
  }
}
