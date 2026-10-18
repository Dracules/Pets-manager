import { Type } from '@nestjs/common';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema, Types } from 'mongoose';

export class Animal {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  owner: string;

  @Prop({ maxlength: 1000 })
  description?: string;
}

export const createAnimalSchema = <T extends Animal>(
  specificSchema: Type<T>,
): Schema<T> => {
  return SchemaFactory.createForClass(specificSchema);
};
