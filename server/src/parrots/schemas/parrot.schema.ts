import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Animal, createAnimalSchema } from '../../animal/schemas/animal.schema';

export type ParrotDocument = HydratedDocument<Parrot>;

@Schema({ versionKey: false })
export class Parrot extends Animal {
  @Prop({ type: [String], _id: false, default: undefined })
  vocabulary?: string[];
}

export const ParrotSchema = createAnimalSchema(Parrot);
