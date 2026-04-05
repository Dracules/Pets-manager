import { Type } from '@nestjs/common';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class Animal {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  owner: string;
}

export const createAnimalSchema = (specificSchema: Type<any>) => {
  return SchemaFactory.createForClass(specificSchema);
};
