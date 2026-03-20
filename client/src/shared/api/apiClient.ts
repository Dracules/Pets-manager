import axios from 'axios';
import { Cat } from '../../domains/cat/model/cat.interface';
import { Dog } from '../../domains/dog/model/dog.interface';
import { JwtToken } from '../../domains/login/model/jwtToken.interface';

const api = axios.create();
api.interceptors.request.use();
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class ApiClient {
  async get<T>(Url: string): Promise<T> {
    return api
      .get<T>(Url)
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }
}

const apiClient = new ApiClient();

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

export async function getDogs(): Promise<Dog[]> {
  return apiClient.get<Dog[]>('/animals/dogs');
}

export async function getCats(): Promise<Cat[]> {
  return apiClient.get<Cat[]>('/animals/cats');
}

export async function getUserCats(): Promise<Cat[]> {
  return apiClient.get<Cat[]>('/animals/cats/user');
}
