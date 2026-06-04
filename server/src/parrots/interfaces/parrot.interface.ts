import { AnimalResponse } from '../../animal/interfaces/animal.interface';

export interface ParrotResponse extends AnimalResponse {
  vocabulary?: string[];
}
