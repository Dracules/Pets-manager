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

export class DogDTO extends AnimalDTO {
  @Transform(({ value }) => new Date(value))
  @IsDefined()
  @IsDate()
  birthDate: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  trainedCommands?: string[];
}

export class UpdateDogDTO extends PartialType(DogDTO) {}
