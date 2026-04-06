import { Animal } from './animal.interface';
import { AnimalType } from './animal.type';

export interface AnimalResponse extends Animal {
  type: AnimalType;
}
