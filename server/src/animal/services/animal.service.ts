import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cat, CatDocument } from '../../cats/schemas/cat.schema';
import { AnimalResponse } from '../interfaces/animal.interface';
import { PaginationResult } from '../interfaces/pagination.result';

@Injectable()
export class AnimalService {
  constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>) {}

  async findAllAnimals(
    limit: number,
    skip: number,
  ): Promise<PaginationResult<AnimalResponse[]>> {
    const [animals, totalResult] = await Promise.all([
      this.catModel
        .aggregate([
          { $addFields: { type: 'cat' } },
          {
            $unionWith: {
              coll: 'dogs',
              pipeline: [{ $addFields: { type: 'dog' } }],
            },
          },
          { $sort: { _id: 1 } },
          { $skip: skip },
          { $limit: limit },
        ])
        .exec(),

      this.catModel
        .aggregate([
          { $addFields: { type: 'cat' } },
          {
            $unionWith: {
              coll: 'dogs',
              pipeline: [{ $addFields: { type: 'dog' } }],
            },
          },
          { $count: 'total' },
        ])
        .exec(),
    ]);

    const total: number = totalResult[0]?.total || 0;

    return {
      animals: animals as AnimalResponse[],
      totalPages: Math.floor(total / limit) + 1,
    };
  }

  async findAnimalsByUser(
    userId: string,
    limit: number,
    skip: number,
  ): Promise<PaginationResult<AnimalResponse[]>> {
    const userObjectId = new Types.ObjectId(userId);
    const [animals, totalResult] = await Promise.all([
      this.catModel
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
          { $sort: { _id: 1 } },
          { $skip: skip },
          { $limit: limit },
        ])
        .exec(),

      this.catModel
        .aggregate([
          { $match: { owner: userObjectId } },
          {
            $unionWith: {
              coll: 'dogs',
              pipeline: [{ $match: { owner: userObjectId } }],
            },
          },
          { $count: 'total' },
        ])
        .exec(),
    ]);

    const total: number = totalResult[0]?.total || 0;
    return {
      animals: animals as AnimalResponse[],
      totalPages: Math.floor(total / limit) + 1,
    };
  }
}
