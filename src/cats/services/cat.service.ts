import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument } from '../../cats/schemas/cat.schema';
import { Model } from 'mongoose';
import { CatDTO } from '../dto/cat.dto';
import { BaseAnimalService } from '../../animal/services/base.animal.service';

@Injectable()
export class CatService extends BaseAnimalService<CatDocument, CatDTO> {
  constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>) {
    super(catModel);
  }
}
