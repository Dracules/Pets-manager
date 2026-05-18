import { Injectable } from '@nestjs/common';
import { AnimalDTO } from '../dto/animal.dto';
import { HydratedDocument, Model, Types, UpdateQuery } from 'mongoose';
import { AnimalException } from '../exception_filters/exceptions/animal.exception';
import { Animal } from '../schemas/animal.schema';
import { AnimalResponse } from '../interfaces/animal.interface';
import { AnimalType } from '../types/animal.type';
import { PaginationResult } from '../interfaces/pagination.result';
import { calculateAge } from '../../shared/utils/utils';

@Injectable()
export abstract class BaseAnimalService<
  T extends HydratedDocument<Animal>,
  DTO extends AnimalDTO,
  Response extends AnimalResponse,
> {
  constructor(protected model: Model<T>) {}

  async create(animalDTO: DTO, userId: string): Promise<Response> {
    const createdAnimal = new this.model({
      ...animalDTO,
      owner: new Types.ObjectId(userId),
    });
    const savedAnimal = await createdAnimal.save();
    return savedAnimal.toJSON() as unknown as Response;
  }

  async findAll(
    limit: number,
    skip: number,
  ): Promise<PaginationResult<Response[]>> {
    const animalType = this.model.modelName.toLowerCase() as AnimalType;

    const [findedAnimals, total] = await Promise.all([
      this.model.find().sort({ _id: 1 }).skip(skip).limit(limit).exec(),
      this.model.countDocuments().exec(),
    ]);

    return {
      animals: findedAnimals.map((obj) => ({
        ...obj.toJSON(),
        type: animalType,
        age: calculateAge(obj.birthDate),
      })) as unknown as Response[],
      totalCount: total,
    };
  }

  async findById(animalId: string): Promise<Response> {
    const animal = await this.model
      .findById(animalId)
      .populate('owner', 'login')
      .exec();
    if (!animal) throw new AnimalException();
    return animal.toJSON() as unknown as Response;
  }

  async findByUser(
    userId: string,
    limit: number,
    skip: number,
  ): Promise<PaginationResult<Response[]>> {
    const [findedAnimals, total] = await Promise.all([
      this.model
        .where('owner')
        .equals(new Types.ObjectId(userId))
        .sort({ _id: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model
        .countDocuments()
        .where('owner')
        .equals(new Types.ObjectId(userId))
        .exec(),
    ]);
    const animalType = this.model.modelName.toLowerCase() as AnimalType;
    return {
      animals: findedAnimals.map((obj) => ({
        ...obj.toJSON(),
        age: calculateAge(obj.birthDate),
        type: animalType,
      })) as unknown as Response[],
      totalCount: total,
    };
  }

  async updateById(
    userId: string,
    animalId: string,
    animalDTO: Partial<DTO>,
    updateProps?: unknown,
  ): Promise<Response> {
    if (await this.isExistedWithIdAndUser(animalId, userId)) {
      const updateObj = animalDTO as unknown as UpdateQuery<T>;
      if (updateProps) Object.assign(updateObj, updateProps);

      const updatedAnimal = await this.model
        .findByIdAndUpdate(animalId, updateObj, {
          new: true,
          runValidators: true,
        })
        .exec();
      if (!updatedAnimal) throw new AnimalException();
      return updatedAnimal.toJSON() as unknown as Response;
    }
    throw new AnimalException();
  }

  async delete(userId: string, animalId: string): Promise<string> {
    if (await this.isExistedWithIdAndUser(animalId, userId)) {
      const deletedAnimal = await this.model.findByIdAndDelete(animalId).exec();
      if (!deletedAnimal) throw new AnimalException();
      return 'Selected item is deleted successfully!';
    }
    throw new AnimalException();
  }

  private async isExistedWithIdAndUser(
    animalId: string,
    userId: string,
  ): Promise<boolean> {
    const animals = await this.model
      .where('_id')
      .equals(animalId)
      .where('owner')
      .equals(new Types.ObjectId(userId));
    return !!animals.length;
  }
}
