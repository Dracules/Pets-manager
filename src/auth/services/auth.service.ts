import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt.payload.interface';
import { JwtToken } from '../interfaces/jwt.token.interface';
import * as bcrypt from 'node_modules/bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(login: string, userPassword: string): Promise<JwtToken> {
    const user = await this.userService.findUser(login);

    if (!user || !(await bcrypt.compare(userPassword, user.password))) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.login,
      roles: user.roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(userlogin: string, userPassword: string): Promise<string> {
    return this.userService.createUser(userlogin, userPassword, ['user']);
  }

  async signUpAdmin(userlogin: string, userPassword: string): Promise<string> {
    return this.userService.createUser(userlogin, userPassword, [
      'user',
      'admin',
    ]);
  }
}
