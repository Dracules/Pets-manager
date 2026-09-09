import apiClient from '../../../shared/api/apiClient';
import { PaginationResult } from '../../../shared/model/interfaces/pagination.result';
import { Cat } from '../model/cat.interface';
import { CatResponse } from '../model/cat.response.interface';

export class CatsApi {
  static async getCats(
    this: void,
    options: string,
  ): Promise<PaginationResult<CatResponse[]>> {
    return apiClient.get<PaginationResult<CatResponse[]>>(
      '/animals/cats' + options,
    );
  }

  static async getUserCats(
    this: void,
    options: string,
    id?: string,
  ): Promise<PaginationResult<CatResponse[]>> {
    if (id)
      return apiClient.get<PaginationResult<CatResponse[]>>(
        `/animals/cats/user/${id}${options}`,
      );
    return apiClient.get<PaginationResult<CatResponse[]>>(
      '/animals/cats/user' + options,
    );
  }

  static async getCatById(this: void, id: string): Promise<Cat> {
    return apiClient.get<Cat>(`/animals/cats/${id}`);
  }

  static async createCat(this: void, data: object): Promise<Cat> {
    return apiClient.post(`/animals/cats`, data);
  }

  static async updateCat<Cat>(
    this: void,
    id: string,
    data: object,
  ): Promise<Cat> {
    return apiClient.put(`/animals/cats/${id}`, data);
  }

  static async deleteCats(this: void, id: string): Promise<string> {
    return apiClient.delete(`/animals/cats/${id}`);
  }
}
