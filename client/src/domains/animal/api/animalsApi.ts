import apiClient from '../../../shared/api/apiClient';
import { PaginationResult } from '../../../shared/model/interfaces/pagination.result';
import { CatsApi } from '../../cat/api/catsApi';
import { DogsApi } from '../../dog/api/dogsApi';
import { ParrotsApi } from '../../parrot/api/parrotsApi';
import { AnimalResponse } from '../model/animal.response.interface';
import { AnimalType } from '../model/animal.type';

export class AnimalsApi {
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
  ): Promise<string> {
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
