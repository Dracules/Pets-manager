import type { Animal } from '../../animal/model/animal.interface';

export interface Dog extends Animal {
  trainedCommands?: string[];
}
