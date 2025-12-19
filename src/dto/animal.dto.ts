import { IsString, IsInt, Min, MinLength, IsDefined } from 'class-validator';

export class AnimalDTO {
  @IsDefined()
  @IsString()
  @MinLength(2)
  name: string;

  @IsDefined()
  @IsInt()
  @Min(0)
  age: number;
}
