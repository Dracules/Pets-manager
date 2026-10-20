import {
  IsArray,
  IsDate,
  IsDefined,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { AnimalDTO } from '../../animal/dto/animal.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsBirthDateRealistic } from '../../shared/validators/isBirthDateRealisticvalidator';

export class ParrotDTO extends AnimalDTO {
  @Transform(({ value }) => new Date(value as string))
  @IsDefined()
  @IsDate()
  @IsBirthDateRealistic(80)
  birthDate: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  vocabulary?: string[];
}

export class UpdateParrotDTO extends PartialType(ParrotDTO) {}
