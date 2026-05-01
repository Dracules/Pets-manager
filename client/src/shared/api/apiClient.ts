import axios, { AxiosError } from 'axios';
import { Cat } from '../../domains/cat/model/cat.interface';
import { Dog } from '../../domains/dog/model/dog.interface';
import api from './axiosApi';
import { AnimalType } from '../../domains/animal/model/animal.type';
import { AnimalResponse } from '../../domains/animal/model/animal.response.interface';
import { DogResponse } from '../../domains/dog/model/dog.response.interface';
import { CatResponse } from '../../domains/cat/model/cat.response.interface';

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

  async delete(Url: string): Promise<string> {
    return api
      .delete<string>(Url)
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  async post<T>(Url: string, data: object): Promise<T> {
    return api
      .post<T>(Url, data)
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  async put<T>(Url: string, data: object): Promise<T> {
    return api
      .put<T>(Url, data)
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }
}

const apiClient = new ApiClient();

export async function deleteAnimals(
  id: string,
  type: AnimalType,
): Promise<string> {
  switch (type) {
    case 'cat':
      return deleteCats(id);
    case 'dog':
      return deleteDogs(id);
    default:
      throw Error('Undefined animal type!');
  }
}

export async function getAnimals(): Promise<AnimalResponse[]> {
  return apiClient.get<AnimalResponse[]>('/animals');
}

export async function getUserAnimals(): Promise<AnimalResponse[]> {
  return apiClient.get<AnimalResponse[]>('/animals/user');
}

export class DogsApi {
  static async getDogs(): Promise<DogResponse[]> {
    return apiClient.get<DogResponse[]>('/animals/dogs');
  }

  static async getUserDogs(): Promise<DogResponse[]> {
    return apiClient.get<DogResponse[]>('/animals/dogs/user');
  }

  static async getDogById(id: string): Promise<Dog> {
    return apiClient.get<Dog>(`/animals/dogs/${id}`);
  }

  static async createDog(data: object): Promise<Dog> {
    return apiClient.post(`/animals/dogs`, data);
  }

  static async updateDog<Dog>(id: string, data: object): Promise<Dog> {
    return apiClient.put(`/animals/dogs/${id}`, data);
  }

  static async deleteDogs(id: string): Promise<string> {
    return apiClient.delete(`/animals/dogs/${id}`);
  }
}

export class CatsApi {
  static async getCats(): Promise<CatResponse[]> {
    return apiClient.get<CatResponse[]>('/animals/cats');
  }

  static async getUserCats(): Promise<CatResponse[]> {
    return apiClient.get<CatResponse[]>('/animals/cats/user');
  }

  static async getCatById(id: string): Promise<Cat> {
    return apiClient.get<Cat>(`/animals/cats/${id}`);
  }

  static async createCat(data: object): Promise<Cat> {
    return apiClient.post(`/animals/cats`, data);
  }

  static async updateCat<Cat>(id: string, data: object): Promise<Cat> {
    return apiClient.put(`/animals/cats/${id}`, data);
  }

  static async deleteCats(id: string): Promise<string> {
    return apiClient.delete(`/animals/cats/${id}`);
  }
}
