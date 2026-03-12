import { Animal } from '../../base/model/animal.interface';
import { LitterStatus } from './litterStatus.type';

export interface Cat extends Animal {
  litterStatus: LitterStatus;
}
