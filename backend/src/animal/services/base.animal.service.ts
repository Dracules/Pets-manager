import { Injectable } from '@nestjs/common';
import { AnimalDTO } from '../dto/animal.dto';
import { HydratedDocument, Model, Types, UpdateQuery } from 'mongoose';
import { AnimalException } from '../exception_filters/exceptions/animal.exception';
import { Animal } from '../schemas/animal.schema';
import { AnimalResponse } from '../interfaces/animal.interface';

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

  async findAll(): Promise<Response[]> {
    const findedAnimals = await this.model.find().exec();
    return findedAnimals.map((obj) => obj.toJSON()) as unknown as Response[];
  }

  async findById(animalId: string): Promise<Response> {
    const animal = await this.model
      .findById(animalId)
      .populate('owner', 'login')
      .exec();
    if (!animal) throw new AnimalException();
    return animal.toJSON() as unknown as Response;
  }

  async findByUser(userId: string): Promise<Response[]> {
    const findedAnimals = await this.model
      .where('owner')
      .equals(new Types.ObjectId(userId));
    return findedAnimals.map((obj) => obj.toJSON()) as unknown as Response[];
  }

  async updateById(
    userId: string,
    animalId: string,
    animalDTO: Partial<DTO>,
    updateProps: unknown,
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
