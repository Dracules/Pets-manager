import { IsEnum, IsOptional } from 'class-validator';
import { AnimalDTO } from '../../animal/dto/animal.dto';
import { LITTER_STATUS, type LitterStatus } from '../types/litterStatus.type';
import { PartialType } from '@nestjs/mapped-types';

export class CatDTO extends AnimalDTO {
  @IsOptional()
  @IsEnum(LITTER_STATUS)
  litterStatus: LitterStatus;
}

export class UpdateCatDTO extends PartialType(CatDTO) {}
