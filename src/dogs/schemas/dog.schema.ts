import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Animal, createAnimalSchema } from '../../animal/schemas/animal.schema';

export type DogDocument = HydratedDocument<Dog>;

@Schema({ versionKey: false })
export class Dog extends Animal {
  @Prop({ type: [String], _id: false })
  trainedCommands?: string[];
}

export const DogSchema = createAnimalSchema(Dog);
