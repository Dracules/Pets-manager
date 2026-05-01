import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  AccessJwtPayload,
  RefreshJwtPayload,
} from '../interfaces/jwt.payload.interface';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { FullJwtToken } from '../interfaces/jwt.token.interface';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  private async getNewJwtToken(
    sub: string,
    username: string,
    roles: ('admin' | 'user')[] | undefined,
  ): Promise<FullJwtToken> {
    const accessPayload: AccessJwtPayload = {
      sub: sub,
      username: username,
      roles: roles,
    };

    const refreshPayload: RefreshJwtPayload = {
      sub: sub,
    };
    const access_token = await this.jwtService.signAsync(accessPayload, {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN') ?? '20m',
    });
    const refresh_token = await this.jwtService.signAsync(refreshPayload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') ?? '7d',
    });
    return { access_token: access_token, refresh_token: refresh_token };
  }

  async signIn(login: string, userPassword: string): Promise<FullJwtToken> {
    const user = await this.userService.findUserByLogin(login);

    if (!user || !(await bcrypt.compare(userPassword, user.password))) {
      throw new UnauthorizedException();
    }

    const userId = user._id.toString();

    const newJwtToken = await this.getNewJwtToken(
      userId,
      user.login,
      user.roles,
    );

    await this.userService.updateRefreshToken(
      userId,
      newJwtToken.refresh_token,
    );
    return newJwtToken;
  }

  async refresh(refreshToken: string) {
    const payload = await this.jwtService
      .verifyAsync<RefreshJwtPayload>(refreshToken)
      .catch(() => {
        throw new UnauthorizedException();
      });

    const userId = payload.sub;

    const refreshTokenDB = await this.userService.getUserRefreshToken(userId);

    const isValid =
      refreshTokenDB && (await bcrypt.compare(refreshToken, refreshTokenDB));
    if (!isValid) {
      throw new UnauthorizedException();
    }

    const user = (await this.userService.findUserById(userId)) as User;

    const newJwtToken = await this.getNewJwtToken(
      userId,
      user.login,
      user.roles,
    );
    await this.userService.updateRefreshToken(
      userId,
      newJwtToken.refresh_token,
    );
    return newJwtToken;
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
