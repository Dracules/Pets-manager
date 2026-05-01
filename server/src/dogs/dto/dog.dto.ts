import { IsArray, IsOptional, IsString, Max } from 'class-validator';
import { AnimalDTO } from '../../animal/dto/animal.dto';
import { PartialType } from '@nestjs/mapped-types';

export class DogDTO extends AnimalDTO {
  @Max(30)
  declare age: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  trainedCommands?: string[];
}

export class UpdateDogDTO extends PartialType(DogDTO) {}
