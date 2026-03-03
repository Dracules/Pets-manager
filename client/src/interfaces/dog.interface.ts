import { Animal } from './animal.interface';

export interface Dog extends Animal {
  trainedCommands?: string[];
}
