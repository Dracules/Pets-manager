import { Injectable } from '@nestjs/common';
import { User } from 'src/interfaces/user';

@Injectable()
export class UserService {
  constructor() {}

  private users: User[] = [
    { id: '1', login: 'login', password: 'password' },
    { id: '2', login: 'admin', password: 'adminpassword' },
    { id: '3', login: 'user', password: 'userpassword' },
  ];

  findUser(login: string): User | undefined {
    return this.users.find((user) => user.login === login);
  }
}
