import apiClient from '../../../shared/api/apiClient';
import type { PaginationResult } from '../../../shared/model/interfaces/pagination.result';
import CatsApi from '../../cat/api/catsApi';
import DogsApi from '../../dog/api/dogsApi';
import ParrotsApi from '../../parrot/api/parrotsApi';
import type { AnimalResponse } from '../model/animal.response.interface';
import type { AnimalType } from '../model/animal.type';

export default class AnimalsApi {
  static async getAnimals(
    this: void,
    options: string,
  ): Promise<PaginationResult<AnimalResponse[]>> {
    return apiClient.get<PaginationResult<AnimalResponse[]>>(
      '/animals' + options,
    );
  }

  static async getUserAnimals(
    this: void,
    options: string,
    id?: string,
  ): Promise<PaginationResult<AnimalResponse[]>> {
    const uri = id
      ? `/animals/user/${id}${options}`
      : '/animals/user' + options;

    return apiClient.get<PaginationResult<AnimalResponse[]>>(uri);
  }

  static async deleteAnimals(
    this: void,
    id: string,
    type: AnimalType,
  ): Promise<void> {
    switch (type) {
      case 'cat':
        return CatsApi.deleteCats(id);
      case 'dog':
        return DogsApi.deleteDogs(id);
      case 'parrot':
        return ParrotsApi.deleteParrots(id);
      default:
        throw Error('Undefined animal type!');
    }
  }
}
