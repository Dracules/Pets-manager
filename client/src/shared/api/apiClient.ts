import axios, { AxiosError } from 'axios';
import { Cat } from '../../domains/cat/model/cat.interface';
import { Dog } from '../../domains/dog/model/dog.interface';
import { JwtToken } from '../../domains/login/model/jwtToken.interface';

const api = axios.create();
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwtToken');
    }
    return Promise.reject(error);
  },
);

export function isApiError(e: unknown): e is AxiosError {
  return axios.isAxiosError(e);
}

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

export async function getDogs(): Promise<Dog[]> {
  return apiClient.get<Dog[]>('/animals/dogs');
}

export async function getCats(): Promise<Cat[]> {
  return apiClient.get<Cat[]>('/animals/cats');
}

export async function getUserCats(): Promise<Cat[]> {
  return apiClient.get<Cat[]>('/animals/cats/user');
}
