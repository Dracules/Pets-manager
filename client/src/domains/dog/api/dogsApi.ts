import apiClient from '../../../shared/api/apiClient';
import type { PaginationResult } from '../../../shared/model/interfaces/pagination.result';
import type { Dog } from '../model/dog.interface';
import type { DogResponse } from '../model/dog.response.interface';

export default class DogsApi {
  static async getDogs(
    this: void,
    options: string,
  ): Promise<PaginationResult<DogResponse[]>> {
    return apiClient.get<PaginationResult<DogResponse[]>>(
      '/animals/dogs' + options,
    );
  }

  static async getUserDogs(
    this: void,
    options: string,
    id?: string,
  ): Promise<PaginationResult<DogResponse[]>> {
    const uri = id
      ? `/animals/dogs/user/${id}${options}`
      : '/animals/dogs/user' + options;

    return apiClient.get<PaginationResult<DogResponse[]>>(uri);
  }

  static async getDogById(this: void, id: string): Promise<Dog> {
    return apiClient.get<Dog>(`/animals/dogs/${id}`);
  }

  static async createDog(data: object): Promise<Dog> {
    return apiClient.post(`/animals/dogs`, data);
  }

  static async updateDog<Dog>(
    this: void,
    id: string,
    data: object,
  ): Promise<Dog> {
    return apiClient.put(`/animals/dogs/${id}`, data);
  }

  static async deleteDogs(this: void, id: string): Promise<string> {
    return apiClient.delete(`/animals/dogs/${id}`);
  }
}
