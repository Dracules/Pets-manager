import type { ResponseWithAnimalType } from '../../../shared/model/interfaces/response.with.animal.type.interface';
import type { Parrot } from './parrot.interface';

export interface ParrotResponse extends Parrot, ResponseWithAnimalType {}
