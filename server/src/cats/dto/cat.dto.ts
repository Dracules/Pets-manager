import { IsDate, IsDefined, IsEnum, IsOptional } from 'class-validator';
import { AnimalDTO } from '../../animal/dto/animal.dto';
import { LITTER_STATUS, type LitterStatus } from '../types/litterStatus.type';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsBirthDateRealistic } from '../../shared/validators/isBirthDateRealisticvalidator';

export class CatDTO extends AnimalDTO {
  @Transform(({ value }) => new Date(value))
  @IsDefined()
  @IsDate()
  @IsBirthDateRealistic(40)
  birthDate: Date;

  @IsOptional()
  @IsEnum(LITTER_STATUS)
  litterStatus: LitterStatus;
}

export class UpdateCatDTO extends PartialType(CatDTO) {}
