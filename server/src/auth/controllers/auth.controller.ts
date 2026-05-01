import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { Public } from '../../shared/decorators/public.decorator';
import { AuthService } from '../services/auth.service';
import type { RequestWithUser } from '../../shared/interfaces/request-with-user';
import type { JwtPayload } from '../interfaces/jwt.payload.interface';
import { JwtToken } from '../interfaces/jwt.token.interface';
import { SignInDTO, SignUpDTO } from '../dto/sign.in.dto';
import { Roles } from '../../shared/decorators/roles.decorator';
import type {
  FullJwtToken,
  RefreshJwtToken,
} from '../interfaces/jwt.token.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDTO): Promise<FullJwtToken> {
    return await this.authService.signIn(signInDto.login, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async signUp(@Body() signUpDTO: SignUpDTO): Promise<string> {
    return await this.authService.signUp(signUpDTO.login, signUpDTO.password);
  }

  @Roles(['admin'])
  @HttpCode(HttpStatus.OK)
  @Post('register/admin')
  async signUpAdmin(@Body() signUpDTO: SignUpDTO): Promise<string> {
    return await this.authService.signUpAdmin(
      signUpDTO.login,
      signUpDTO.password,
    );
  }

  @Get('profile')
  getProfile(@Request() req: RequestWithUser): JwtPayload {
    return req.user;
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() body: RefreshJwtToken): Promise<FullJwtToken> {
    return await this.authService.refresh(body.refresh_token);
  }
}
