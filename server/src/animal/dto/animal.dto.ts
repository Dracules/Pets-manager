import {
  IsString,
  IsInt,
  Min,
  MinLength,
  IsDefined,
  MaxLength,
} from 'class-validator';

export class AnimalDTO {
  @IsDefined()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}
