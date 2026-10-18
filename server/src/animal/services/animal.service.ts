import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cat, CatDocument } from '../../cats/schemas/cat.schema';
import type { AnimalResponse } from '../interfaces/animal.interface';
import type { PaginationResult } from '../interfaces/pagination.result';
import { calculateAge } from '../../shared/utils/utils';
import type { AnimalType } from '../types/animal.type';

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
          { $addFields: { type: 'cat' as AnimalType } },
          {
            $unionWith: {
              coll: 'dogs',
              pipeline: [{ $addFields: { type: 'dog' as AnimalType } }],
            },
          },
          {
            $unionWith: {
              coll: 'parrots',
              pipeline: [{ $addFields: { type: 'parrot' as AnimalType } }],
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'owner',
            },
          },
          {
            $unwind: {
              path: '$owner',
              preserveNullAndEmptyArrays: true,
            },
          },
          { $sort: { _id: 1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              name: 1,
              age: 1,
              birthDate: 1,
              type: 1,
              owner: { _id: '$owner._id', login: '$owner.login' },
              description: 1,
            },
          },
        ])
        .exec(),

      this.catModel
        .aggregate([
          { $addFields: { type: 'cat' as AnimalType } },
          {
            $unionWith: {
              coll: 'dogs',
              pipeline: [{ $addFields: { type: 'dog' as AnimalType } }],
            },
          },
          {
            $unionWith: {
              coll: 'parrots',
              pipeline: [{ $addFields: { type: 'parrot' as AnimalType } }],
            },
          },
          { $count: 'total' },
        ])
        .exec(),
    ]);

    const total = (totalResult[0] as { total: number })?.total || 0;

    return {
      animals: (animals as AnimalResponse[]).map((obj) => ({
        ...obj,
        age: calculateAge(obj.birthDate),
      })),
      totalCount: total,
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
          { $addFields: { type: 'cat' as AnimalType } },
          {
            $unionWith: {
              coll: 'dogs',
              pipeline: [
                { $match: { owner: userObjectId } },
                { $addFields: { type: 'dog' as AnimalType } },
              ],
            },
          },
          {
            $unionWith: {
              coll: 'parrots',
              pipeline: [
                { $match: { owner: userObjectId } },
                { $addFields: { type: 'parrot' as AnimalType } },
              ],
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'owner',
            },
          },
          {
            $unwind: {
              path: '$owner',
              preserveNullAndEmptyArrays: true,
            },
          },
          { $sort: { _id: 1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              name: 1,
              age: 1,
              birthDate: 1,
              type: 1,
              owner: { _id: '$owner._id', login: '$owner.login' },
              description: 1,
            },
          },
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
          {
            $unionWith: {
              coll: 'parrots',
              pipeline: [{ $match: { owner: userObjectId } }],
            },
          },
          { $count: 'total' },
        ])
        .exec(),
    ]);

    const total = (totalResult[0] as { total: number })?.total || 0;
    return {
      animals: (animals as AnimalResponse[]).map((obj) => ({
        ...obj,
        age: calculateAge(obj.birthDate),
      })),
      totalCount: total,
    };
  }
}
