import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Animal, createAnimalSchema } from '../../animal/schemas/animal.schema';
import { LITTER_STATUS, type LitterStatus } from '../types/litterStatus.type';

export type CatDocument = HydratedDocument<Cat>;

@Schema({ versionKey: false })
export class Cat extends Animal {
  @Prop({
    required: true,
    default: 'unknown',
    enum: LITTER_STATUS,
    type: String,
  })
  litterStatus: LitterStatus;
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  owner: string;
}

export const CatSchema = createAnimalSchema(Cat);
