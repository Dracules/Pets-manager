import axios, { AxiosError } from 'axios';
import { Cat } from '../../domains/cat/model/cat.interface';
import { Dog } from '../../domains/dog/model/dog.interface';
import api from './axiosApi';

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
