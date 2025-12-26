import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  signIn(login: string, userPassword: string): any {
    const user = this.userService.findUser(login);
    if (user?.password !== userPassword) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;

    return result;
  }
}
