import { Animal } from '../../animal/interfaces/animal.interface';
import { LitterStatus } from '../types/litterStatus.type';

export interface CatResponse extends Animal {
  litterStatus: LitterStatus;
  owner: string;
}
