import axios from 'axios';
import { JwtToken } from '../../domains/login/model/jwtToken.interface';

export class Auth {
  static async signIn(login: string, password: string): Promise<JwtToken> {
    return axios
      .post<JwtToken>('/auth/login', { login: login, password: password })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }
}
