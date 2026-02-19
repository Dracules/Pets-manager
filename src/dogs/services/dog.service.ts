import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Dog, DogDocument } from '../../dogs/schemas/dog.schema';
import { Model } from 'mongoose';
import { DogDTO } from '../dto/dog.dto';
import { BaseAnimalService } from '../../animal/services/base.animal.service';

@Injectable()
export class DogService extends BaseAnimalService<DogDocument, DogDTO> {
  constructor(@InjectModel(Dog.name) private dogModel: Model<DogDocument>) {
    super(dogModel);
  }
}
