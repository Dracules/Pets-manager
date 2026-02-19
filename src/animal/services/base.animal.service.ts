import { Injectable } from '@nestjs/common';
import { AnimalDTO } from '../dto/animal.dto';
import { HydratedDocument, Model, Types, UpdateQuery } from 'mongoose';
import { AnimalException } from '../exception_filters/exceptions/animal.exception';
import { Animal } from '../schemas/animal.schema';

@Injectable()
export abstract class BaseAnimalService<
  T extends HydratedDocument<Animal>,
  DTO extends AnimalDTO,
> {
  constructor(protected model: Model<T>) {}

  async create(animalDTO: DTO, userId: string): Promise<DTO> {
    const createdAnimal = new this.model({
      ...animalDTO,
      owner: new Types.ObjectId(userId),
    });
    return createdAnimal.save() as unknown as Promise<DTO>;
  }

  async findAll(): Promise<DTO[]> {
    return this.model.find().exec() as unknown as Promise<DTO[]>;
  }

  async findById(animalId: string): Promise<DTO> {
    const animal = await this.model
      .findById(animalId)
      .populate('owner', 'login')
      .exec();
    if (!animal) throw new AnimalException();
    return animal as unknown as Promise<DTO>;
  }

  async findByUser(userId: string): Promise<DTO[]> {
    return this.model
      .where('owner')
      .equals(new Types.ObjectId(userId)) as unknown as Promise<DTO[]>;
  }

  async updateById(
    userId: string,
    animalId: string,
    animalDTO: Partial<DTO>,
  ): Promise<DTO> {
    if (await this.isExistedWithIdAndUser(animalId, userId)) {
      const updatedAnimal = await this.model
        .findByIdAndUpdate(animalId, animalDTO as unknown as UpdateQuery<T>, {
          new: true,
          runValidators: true,
        })
        .exec();
      if (!updatedAnimal) throw new AnimalException();
      return updatedAnimal as unknown as DTO;
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
