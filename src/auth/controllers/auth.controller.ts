import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { Public } from 'src/shared/decorators/public.decorator';
import { AuthService } from 'src/auth/services/auth.service';
import type { RequestWithUser } from 'src/shared/interfaces/request-with-user';
import type { JwtPayload } from '../interfaces/jwt.payload.interface';
import { JwtToken } from '../interfaces/jwt.token.interface';
import { SignInDTO } from '../dto/sign.in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDTO): Promise<JwtToken> {
    return await this.authService.signIn(signInDto.login, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async signUp(@Body() signInDto: SignInDTO): Promise<string> {
    return await this.authService.signUp(signInDto.login, signInDto.password);
  }

  @Get('profile')
  getProfile(@Request() req: RequestWithUser): JwtPayload {
    return req.user;
  }
}
