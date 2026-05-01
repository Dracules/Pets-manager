import {
  IsString,
  MinLength,
  IsDefined,
  MaxLength,
  Matches,
} from 'class-validator';

export class SignInDTO {
  @IsDefined()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_-]+$/)
  login: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  password: string;
}
