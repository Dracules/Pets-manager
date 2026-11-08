import apiClient from '../../../shared/api/apiClient';
import type { PaginationResult } from '../../../shared/model/interfaces/pagination.result';
import type { Parrot } from '../model/parrot.interface';
import type { ParrotResponse } from '../model/parrot.response.interface';

export default class ParrotsApi {
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
    const uri = id
      ? `/animals/parrots/user/${id}${options}`
      : '/animals/parrots/user' + options;

    return apiClient.get<PaginationResult<ParrotResponse[]>>(uri);
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
    return apiClient.patch(`/animals/parrots/${id}`, data);
  }

  static async deleteParrots(this: void, id: string): Promise<void> {
    await apiClient.delete(`/animals/parrots/${id}`);
  }
}
