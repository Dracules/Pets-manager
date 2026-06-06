import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseAnimalService } from '../../animal/services/base.animal.service';
import { ParrotDTO } from '../dto/parrot.dto';
import { ParrotResponse } from '../interfaces/parrot.interface';
import { ParrotDocument, Parrot } from '../schemas/parrot.schema';

@Injectable()
export class ParrotService extends BaseAnimalService<
  ParrotDocument,
  ParrotDTO,
  ParrotResponse
> {
  constructor(
    @InjectModel(Parrot.name) private parrotModel: Model<ParrotDocument>,
  ) {
    super(parrotModel);
  }
}
