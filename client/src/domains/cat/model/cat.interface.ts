import type { Animal } from '../../animal/model/animal.interface';
import { type LitterStatus } from './litterStatus.type';

export interface Cat extends Animal {
  litterStatus: LitterStatus;
}
