import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../services/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    login: string,
    userPassword: string,
  ): Promise<{ access_token: string }> {
    const user = this.userService.findUser(login);
    if (user?.password !== userPassword) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.login, roles: user.roles };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
