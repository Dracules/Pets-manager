import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import type { UserRole } from '../../shared/types/userRole.type';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUserByLogin(userLogin: string) {
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

  async getUserRefreshToken(userId: string) {
    const refreshTokenDB = await this.userModel
      .findById(userId)
      .select('refresh_token')
      .then((user) => user?.refresh_token);
    return refreshTokenDB;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const salt = await bcrypt.genSalt(12);
    const refresTokenHash = await bcrypt.hash(refreshToken, salt);

    return await this.userModel
      .findByIdAndUpdate(
        userId,
        { refresh_token: refresTokenHash },
        { runValidators: true, returnDocument: 'after' },
      )
      .lean();
  }
}
