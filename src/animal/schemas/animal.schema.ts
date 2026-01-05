import { Prop, SchemaFactory } from '@nestjs/mongoose';

export class Animal {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;
}

export const createAnimalSchema = (specificSchema: any) => {
  const schema = SchemaFactory.createForClass(specificSchema);

  schema.virtual('id').get(function () {
    return this._id!.toString();
  });

  schema.set('toJSON', {
    virtuals: true,
    transform: (_doc, ret) => {
      delete ret._id;
      return ret;
    },
  });

  return schema;
};
