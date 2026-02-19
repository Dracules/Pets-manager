import { AnimalResponse } from '../../animal/interfaces/animal.interface';
import { LitterStatus } from '../types/litterStatus.type';

export interface CatResponse extends AnimalResponse {
  litterStatus: LitterStatus;
}
