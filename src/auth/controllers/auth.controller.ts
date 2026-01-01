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
import { JwtToken } from '../interfaces/jwt.token.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDTO): Promise<JwtToken> {
    return await this.authService.signIn(signInDto.login, signInDto.password);
  }

  @Get('profile')
  getProfile(@Request() req: RequestWithUser): JwtPayload {
    return req.user;
  }
}
