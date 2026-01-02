import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUser(userLogin: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ login: userLogin });
  }

  async createUser(userLogin: string, userPassword: string): Promise<string> {
    const newUser = new this.userModel({
      login: userLogin,
      password: userPassword,
      roles: ['user'],
    });
    const result = await newUser.save();
    return `Пользователь с логином ${result.login} успешно создан!`;
  }
}
