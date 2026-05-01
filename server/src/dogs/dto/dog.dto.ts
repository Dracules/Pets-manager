import {
  IsArray,
  IsDefined,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { AnimalDTO } from '../../animal/dto/animal.dto';
import { PartialType } from '@nestjs/mapped-types';

export class DogDTO extends AnimalDTO {
  @IsDefined()
  @IsInt()
  @Min(0)
  @Max(30)
  age: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  trainedCommands?: string[];
}

export class UpdateDogDTO extends PartialType(DogDTO) {}
