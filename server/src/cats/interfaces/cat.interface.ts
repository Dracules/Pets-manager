import type { AnimalResponse } from '../../animal/interfaces/animal.interface';
import { type LitterStatus } from '../types/litterStatus.type';

export interface CatResponse extends AnimalResponse {
  litterStatus: LitterStatus;
}
