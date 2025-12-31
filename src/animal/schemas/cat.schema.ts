import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema({ versionKey: false })
export class Cat {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;
}

export const CatSchema = SchemaFactory.createForClass(Cat);

CatSchema.virtual('id').get(function () {
  return this._id.toString();
});

CatSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret: Record<string, any>) => {
    delete ret._id;
    return ret;
  },
});
