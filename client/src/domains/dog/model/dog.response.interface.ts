import type { ResponseWithAnimalType } from '../../../shared/model/interfaces/response.with.animal.type.interface';
import type { Dog } from './dog.interface';

export interface DogResponse extends Dog, ResponseWithAnimalType {}
