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

export class DogDTO extends AnimalDTO {
  @Transform(({ value }) => new Date(value))
  @IsDefined()
  @IsDate()
  @IsBirthDateRealistic(30)
  birthDate: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  trainedCommands?: string[];
}

export class UpdateDogDTO extends PartialType(DogDTO) {}
