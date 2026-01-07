import { Injectable } from '@nestjs/common';
import { AnimalException } from 'src/animal/exception_filters/exceptions/animal.exception';
import { AnimalDTO } from 'src/animal/dto/animal.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument } from 'src/cats/schemas/cat.schema';
import { Model } from 'mongoose';

@Injectable()
export class CatService {
  constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>) {}

  async create(catDTO: AnimalDTO): Promise<CatDocument> {
    const createdCat = new this.catModel(catDTO);
    return createdCat.save();
  }

  async findAll(): Promise<CatDocument[]> {
    return this.catModel.find().exec();
  }

  async findById(id: string): Promise<CatDocument> {
    const cat = await this.catModel.findById(id).exec();
    if (!cat) throw new AnimalException();
    return cat;
  }

  async updateById(
    id: string,
    catDTO: Partial<AnimalDTO>,
  ): Promise<CatDocument> {
    const updatedCat = await this.catModel
      .findByIdAndUpdate(id, catDTO, { new: true, runValidators: true })
      .exec();
    if (!updatedCat) throw new AnimalException();
    return updatedCat;
  }

  async delete(id: string): Promise<string> {
    const deletedCat = await this.catModel.findByIdAndDelete(id).exec();
    if (!deletedCat) throw new AnimalException();
    return 'Selected item is deleted successfully!';
  }
}
