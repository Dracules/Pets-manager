import { IsString, IsInt, Min, MinLength } from 'class-validator';

export class AnimalDTO {
  @IsString()
  @MinLength(2)
  name: string;

  @IsInt()
  @Min(0)
  age: number;
}
