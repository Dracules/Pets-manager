import apiClient from '../../../shared/api/apiClient';
import { CatsApi } from '../../cat/api/catsApi';
import { DogsApi } from '../../dog/api/dogsApi';
import { AnimalResponse } from '../model/animal.response.interface';
import { AnimalType } from '../model/animal.type';

export class AnimalsApi {
  static async getAnimals(): Promise<AnimalResponse[]> {
    return apiClient.get<AnimalResponse[]>('/animals');
  }

  static async getUserAnimals(): Promise<AnimalResponse[]> {
    return apiClient.get<AnimalResponse[]>('/animals/user');
  }

  static async deleteAnimals(id: string, type: AnimalType): Promise<string> {
    switch (type) {
      case 'cat':
        return CatsApi.deleteCats(id);
      case 'dog':
        return DogsApi.deleteDogs(id);
      default:
        throw Error('Undefined animal type!');
    }
  }
}
