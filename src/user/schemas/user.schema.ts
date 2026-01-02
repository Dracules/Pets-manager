import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { USER_ROLES, UserRole } from 'src/shared/types/userRole.type';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  id: string;

  @Prop({ required: true, unique: true })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], enum: USER_ROLES })
  roles?: UserRole[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function () {
  return this._id.toString();
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret: Record<string, any>) => {
    delete ret._id;
    return ret;
  },
});
