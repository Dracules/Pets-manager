import { AnimalResponse } from '../../animal/interfaces/animal.interface';

export interface DogResponse extends AnimalResponse {
  trainedCommands?: string[];
}
