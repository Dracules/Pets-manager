import { IsString, MinLength, IsDefined } from 'class-validator';

export class SignInDTO {
  @IsDefined()
  @IsString()
  @MinLength(2)
  login: string;

  @IsDefined()
  @IsString()
  @MinLength(2)
  password: string;
}
