import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Animal, createAnimalSchema } from 'src/animal/schemas/animal.schema';
import { LITTER_SRATUS, type LitterStatus } from '../types/litterStatus.type';

export type CatDocument = HydratedDocument<Cat>;

@Schema({ versionKey: false })
export class Cat extends Animal {
  @Prop({
    required: true,
    default: 'unknown',
    enum: LITTER_SRATUS,
  })
  litterStatus: LitterStatus;
}

export const CatSchema = createAnimalSchema(Cat);
