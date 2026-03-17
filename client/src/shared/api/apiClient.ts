import axios from 'axios';
import { Cat } from '../../domains/cat/model/cat.interface';
import { Dog } from '../../domains/dog/model/dog.interface';
import { JwtToken } from '../../domains/login/model/jwtToken.interface';

class ApiClient {
  async get<T>(Url: string): Promise<T> {
    return axios
      .get<T>(Url)
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }
}

const api = new ApiClient();

export class Auth {
  static async signUp(login: string, password: string): Promise<JwtToken> {
    return axios
      .post<JwtToken>('/auth/login', { login: login, password: password })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }
}

export async function getDogs(): Promise<Dog[]> {
  return api.get<Dog[]>('/animals/dogs');
}

export async function getCats(): Promise<Cat[]> {
  return api.get<Cat[]>('/animals/cats');
}
