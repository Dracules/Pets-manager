import api from './axiosApi';
import { FullJwtToken } from '../../domains/login/model/jwtToken.interface';

export class Auth {
  static async signIn(login: string, password: string): Promise<FullJwtToken> {
    return api
      .post<FullJwtToken>('/auth/login', { login: login, password: password })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  static async signUp(login: string, password: string): Promise<string> {
    return api
      .post<string>('/auth/register', { login: login, password: password })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  static async refresh(refresh_token: string): Promise<FullJwtToken> {
    return api
      .post<FullJwtToken>('/auth/refresh', {
        refresh_token: refresh_token,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }
}
