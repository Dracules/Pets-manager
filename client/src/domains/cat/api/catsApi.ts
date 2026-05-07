import apiClient from '../../../shared/api/apiClient';
import { Cat } from '../model/cat.interface';
import { CatResponse } from '../model/cat.response.interface';

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
