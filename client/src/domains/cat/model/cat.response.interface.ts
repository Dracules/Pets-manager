import { ResponseWithAnimalType } from '../../../shared/model/interfaces/response.with.animal.type.interface';
import { Cat } from './cat.interface';

export interface CatResponse extends Cat, ResponseWithAnimalType {}
