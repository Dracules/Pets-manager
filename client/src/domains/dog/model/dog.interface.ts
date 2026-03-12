import { Animal } from '../../base/model/animal.interface';

export interface Dog extends Animal {
  trainedCommands?: string[];
}
