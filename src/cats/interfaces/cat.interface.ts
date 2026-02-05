import { Animal } from '../../animal/interfaces/animal.interface';
import { LitterStatus } from '../types/litterStatus.type';

export interface Cat extends Animal {
  litterStatus: LitterStatus;
  owner: string;
}
