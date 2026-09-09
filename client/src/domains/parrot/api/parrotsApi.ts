import apiClient from '../../../shared/api/apiClient';
import { PaginationResult } from '../../../shared/model/interfaces/pagination.result';
import { Parrot } from '../model/parrot.interface';
import { ParrotResponse } from '../model/parrot.response.interface';

export class ParrotsApi {
  static async getParrots(
    this: void,
    options: string,
  ): Promise<PaginationResult<ParrotResponse[]>> {
    return apiClient.get<PaginationResult<ParrotResponse[]>>(
      '/animals/parrots' + options,
    );
  }

  static async getUserParrots(
    this: void,
    options: string,
    id?: string,
  ): Promise<PaginationResult<ParrotResponse[]>> {
    if (id)
      return apiClient.get<PaginationResult<ParrotResponse[]>>(
        `/animals/parrots/user/${id}${options}`,
      );
    return apiClient.get<PaginationResult<ParrotResponse[]>>(
      '/animals/parrots/user' + options,
    );
  }

  static async getParrotById(this: void, id: string): Promise<Parrot> {
    return apiClient.get<Parrot>(`/animals/parrots/${id}`);
  }

  static async createParrot(data: object): Promise<Parrot> {
    return apiClient.post(`/animals/parrots`, data);
  }

  static async updateParrot<Parrot>(
    this: void,
    id: string,
    data: object,
  ): Promise<Parrot> {
    return apiClient.put(`/animals/parrots/${id}`, data);
  }

  static async deleteParrots(this: void, id: string): Promise<string> {
    return apiClient.delete(`/animals/parrots/${id}`);
  }
}
