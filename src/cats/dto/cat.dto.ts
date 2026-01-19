import { IsEnum, IsOptional } from 'class-validator';
import { AnimalDTO } from '../../animal/dto/animal.dto';
import { LITTER_STATUS, type LitterStatus } from '../types/litterStatus.type';

export class CatDTO extends AnimalDTO {
  @IsOptional()
  @IsEnum(LITTER_STATUS)
  litterStatus: LitterStatus;
}
