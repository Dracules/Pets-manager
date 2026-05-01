import apiClient from '../../../shared/api/apiClient';
import { Dog } from '../model/dog.interface';
import { DogResponse } from '../model/dog.response.interface';

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
