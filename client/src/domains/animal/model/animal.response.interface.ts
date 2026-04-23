import { ResponseWithAnimalType } from '../../../shared/model/interfaces/response.with.animal.type.interface';
import { Animal } from './animal.interface';

export interface AnimalResponse extends Animal, ResponseWithAnimalType {}
