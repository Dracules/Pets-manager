import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { UserRole } from '../../shared/types/userRole.type';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUserByLogin(userLogin: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ login: userLogin }).lean();
  }

  async findUserById(userId: string) {
    return this.userModel.findById(userId).lean();
  }

  async createUser(
    userLogin: string,
    userPassword: string,
    userRoles: UserRole[],
  ): Promise<string> {
    const newUser = new this.userModel({
      login: userLogin,
      password: userPassword,
      roles: userRoles,
    });
    const result = await newUser.save();
    return `User with login ${result.login} is created successfully!`;
  }
}
