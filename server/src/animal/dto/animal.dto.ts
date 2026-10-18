import { Transform } from 'class-transformer';
import {
  IsString,
  MinLength,
  IsDefined,
  MaxLength,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class AnimalDTO {
  @IsDefined()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description?: string;
}
