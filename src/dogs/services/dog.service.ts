import { Injectable } from '@nestjs/common';
import { AnimalException } from '../../animal/exception_filters/exceptions/animal.exception';
import { InjectModel } from '@nestjs/mongoose';
import { Dog, DogDocument } from '../../dogs/schemas/dog.schema';
import { Model, Types } from 'mongoose';
import { DogDTO } from '../dto/dog.dto';

@Injectable()
export class DogService {
  constructor(@InjectModel(Dog.name) private dogModel: Model<DogDocument>) {}

  async create(dogDTO: DogDTO, userId: string): Promise<DogDocument> {
    const createdDog = new this.dogModel({
      ...dogDTO,
      owner: new Types.ObjectId(userId),
    });
    return createdDog.save();
  }

  async findAll(): Promise<DogDocument[]> {
    return this.dogModel.find().exec();
  }

  async findById(dogId: string): Promise<DogDocument> {
    const dog = await this.dogModel
      .findById(dogId)
      .populate('owner', 'login')
      .exec();
    if (!dog) throw new AnimalException();
    return dog;
  }

  async findByUser(userId: string): Promise<DogDocument[]> {
    return this.dogModel.where('owner').equals(new Types.ObjectId(userId));
  }

  async updateById(
    userId: string,
    dogId: string,
    dogDTO: Partial<DogDTO>,
  ): Promise<DogDocument> {
    if (await this.isExistedWithIdAndUser(dogId, userId)) {
      const updatedDog = await this.dogModel
        .findByIdAndUpdate(dogId, dogDTO, { new: true, runValidators: true })
        .exec();
      if (!updatedDog) throw new AnimalException();
      return updatedDog;
    }
    throw new AnimalException();
  }

  async delete(userId: string, dogId: string): Promise<string> {
    if (await this.isExistedWithIdAndUser(dogId, userId)) {
      const deletedDog = await this.dogModel.findByIdAndDelete(dogId).exec();
      if (!deletedDog) throw new AnimalException();
      return 'Selected item is deleted successfully!';
    }
    throw new AnimalException();
  }

  private async isExistedWithIdAndUser(
    dogId: string,
    userId: string,
  ): Promise<boolean> {
    const dogs = await this.dogModel
      .where('_id')
      .equals(dogId)
      .where('owner')
      .equals(new Types.ObjectId(userId));
    return !!dogs.length;
  }
}
