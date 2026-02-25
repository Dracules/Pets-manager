import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Animal, createAnimalSchema } from '../../animal/schemas/animal.schema';

export type DogDocument = HydratedDocument<Dog>;

@Schema({ versionKey: false })
export class Dog extends Animal {
  @Prop({ type: [String], _id: false, default: undefined })
  trainedCommands?: string[];
}

export const DogSchema = createAnimalSchema(Dog);
