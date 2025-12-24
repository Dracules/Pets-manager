import { Injectable } from '@nestjs/common';
import { AnimalException } from '../exception_filters/exceptions/animal.exception';
import { AnimalDTO } from '../dto/animal.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cat } from 'src/schemas/cat.schema';
import { Model } from 'mongoose';

@Injectable()
export class AnimalService {
  constructor(@InjectModel(Cat.name) private catModel: Model<Cat>) {}

  async create_DB(catDTO: AnimalDTO): Promise<Cat> {
    const createdCat = new this.catModel(catDTO);
    return createdCat.save();
  }

  async findAll_DB(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }

  async findById_DB(id: number): Promise<Cat> {
    const hard_id = '694ac1f93b5320db21a572a5';
    const cat = await this.catModel.findById(hard_id).exec();
    if (!cat || id < 0) throw new AnimalException();
    return cat;
  }
}
