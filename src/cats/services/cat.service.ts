import { Injectable } from '@nestjs/common';
import { AnimalException } from '../../animal/exception_filters/exceptions/animal.exception';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument } from '../../cats/schemas/cat.schema';
import { Model, Types } from 'mongoose';
import { CatDTO } from '../dto/cat.dto';

@Injectable()
export class CatService {
  constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>) {}

  async create(catDTO: CatDTO, userId: string): Promise<CatDocument> {
    const createdCat = new this.catModel({
      ...catDTO,
      owner: new Types.ObjectId(userId),
    });
    return createdCat.save();
  }

  async findAll(): Promise<CatDocument[]> {
    return this.catModel.find().exec();
  }

  async findById(catId: string): Promise<CatDocument> {
    const cat = await this.catModel
      .findById(catId)
      .populate('owner', 'login')
      .exec();
    if (!cat) throw new AnimalException();
    return cat;
  }

  async updateById(id: string, catDTO: Partial<CatDTO>): Promise<CatDocument> {
    const updatedCat = await this.catModel
      .findByIdAndUpdate(id, catDTO, { new: true, runValidators: true })
      .exec();
    if (!updatedCat) throw new AnimalException();
    return updatedCat;
  }

  async delete(userId: string, catId: string): Promise<string> {
    if (await this.isExistedWithIdAndUser(catId, userId)) {
      const deletedCat = await this.catModel.findByIdAndDelete(catId).exec();
      if (!deletedCat) throw new AnimalException();
      return 'Selected item is deleted successfully!';
    }
    throw new AnimalException();
  }

  private async isExistedWithIdAndUser(
    catId: string,
    userId: string,
  ): Promise<boolean> {
    const cats = await this.catModel
      .where('_id')
      .equals(catId)
      .where('owner')
      .equals(new Types.ObjectId(userId));
    return !!cats.length;
  }
}
