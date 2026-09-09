import apiClient from '../../../shared/api/apiClient';
import { PaginationResult } from '../../../shared/model/interfaces/pagination.result';
import { Dog } from '../model/dog.interface';
import { DogResponse } from '../model/dog.response.interface';

export class DogsApi {
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
    if (id)
      return apiClient.get<PaginationResult<DogResponse[]>>(
        `/animals/dogs/user/${id}${options}`,
      );
    return apiClient.get<PaginationResult<DogResponse[]>>(
      '/animals/dogs/user' + options,
    );
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
