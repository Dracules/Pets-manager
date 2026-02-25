import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Dog, DogDocument } from '../../dogs/schemas/dog.schema';
import { Model } from 'mongoose';
import { DogDTO } from '../dto/dog.dto';
import { BaseAnimalService } from '../../animal/services/base.animal.service';
import { DogResponse } from '../interfaces/dog.interface';

@Injectable()
export class DogService extends BaseAnimalService<
  DogDocument,
  DogDTO,
  DogResponse
> {
  constructor(@InjectModel(Dog.name) private dogModel: Model<DogDocument>) {
    super(dogModel);
  }
}
