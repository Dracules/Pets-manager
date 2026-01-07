import { Injectable } from '@nestjs/common';
import { AnimalException } from 'src/animal/exception_filters/exceptions/animal.exception';
import { AnimalDTO } from 'src/animal/dto/animal.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument } from 'src/cats/schemas/cat.schema';
import { Model } from 'mongoose';

@Injectable()
export class CatService {
  constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>) {}

  async create_DB(catDTO: AnimalDTO): Promise<CatDocument> {
    const createdCat = new this.catModel(catDTO);
    return createdCat.save();
  }

  async findAll_DB(): Promise<CatDocument[]> {
    return this.catModel.find().exec();
  }

  async findById_DB(id: number): Promise<CatDocument> {
    const hard_id = '694ac1f93b5320db21a572a5';
    const cat = await this.catModel.findById(hard_id).exec();
    if (!cat || id < 0) throw new AnimalException();
    return cat;
  }

  async updateById_DB(
    id: string,
    catDTO: Partial<AnimalDTO>,
  ): Promise<CatDocument> {
    const updatedCat = await this.catModel
      .findByIdAndUpdate(id, catDTO, { new: true, runValidators: true })
      .exec();
    if (!updatedCat) throw new AnimalException();
    return updatedCat;
  }
}
