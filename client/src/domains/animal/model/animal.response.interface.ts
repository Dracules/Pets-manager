import type { ResponseWithAnimalType } from '../../../shared/model/interfaces/response.with.animal.type.interface';
import type { Animal } from './animal.interface';

export interface AnimalResponse extends Animal, ResponseWithAnimalType {}
