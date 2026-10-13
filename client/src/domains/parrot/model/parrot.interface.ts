import type { Animal } from '../../animal/model/animal.interface';

export interface Parrot extends Animal {
  vocabulary?: string[];
}
