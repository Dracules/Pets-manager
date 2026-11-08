import { Transform } from 'class-transformer';
import {
  IsString,
  MinLength,
  IsDefined,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class AnimalDTO {
  @IsDefined()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed === '' ? undefined : trimmed;
    }
    return value;
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
