import axios, { AxiosError } from 'axios';
import { Cat } from '../../domains/cat/model/cat.interface';
import { Dog } from '../../domains/dog/model/dog.interface';
import api from './axiosApi';
import { AnimalType } from '../../domains/animal/model/animal.type';
import { AnimalResponse } from '../../domains/animal/model/animal.response.interface';

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

  async post(Url: string, data: object): Promise<Cat> {
    return api
      .post<Cat>(Url, data)
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

export async function getDogs(): Promise<Dog[]> {
  return apiClient.get<Dog[]>('/animals/dogs');
}

export async function getCats(): Promise<Cat[]> {
  return apiClient.get<Cat[]>('/animals/cats');
}

export async function deleteDogs(id: string): Promise<string> {
  return apiClient.delete(`/animals/dogs/${id}`);
}

export async function deleteCats(id: string): Promise<string> {
  return apiClient.delete(`/animals/cats/${id}`);
}

export async function createCat(data: object): Promise<Cat> {
  return apiClient.post(`/animals/cats`, data);
}

export async function createDog(data: object): Promise<Dog> {
  return apiClient.post(`/animals/dogs`, data);
}

export async function deleteAnimals(
  id: string,
  type?: AnimalType,
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

export async function getUserCats(): Promise<Cat[]> {
  return apiClient.get<Cat[]>('/animals/cats/user');
}

export async function getUserDogs(): Promise<Dog[]> {
  return apiClient.get<Dog[]>('/animals/dogs/user');
}

export async function getAnimals(): Promise<AnimalResponse[]> {
  return apiClient.get<AnimalResponse[]>('/animals');
}

export async function getUserAnimals(): Promise<AnimalResponse[]> {
  return apiClient.get<AnimalResponse[]>('/animals/user');
}
