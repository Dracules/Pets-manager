import axios from 'axios';
import { FullJwtToken } from '../../domains/login/model/jwtToken.interface';

export class Auth {
  static async signIn(login: string, password: string): Promise<FullJwtToken> {
    return axios
      .post<FullJwtToken>('/auth/login', { login: login, password: password })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  static async signUp(login: string, password: string): Promise<string> {
    return axios
      .post<string>('/auth/register', { login: login, password: password })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }
}
