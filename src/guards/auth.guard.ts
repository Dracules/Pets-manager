import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { RequestWithUser } from 'src/interfaces/request-with-user';
import { UserRole } from 'src/types/userRole.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log(JSON.stringify(payload));
      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: RequestWithUser): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    console.log(JSON.stringify([type, token]));
    return type === 'Bearer' ? token : undefined;
  }

  OLD_canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const roles: UserRole[] = this.GetRole(request);

    request.user = {
      id: 1,
      name: 'Test User',
      roles,
    };

    return true;
  }

  GetRole(request: RequestWithUser): UserRole[] {
    const authHeader = request.headers['authorization'];

    if (!authHeader) return [];

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') {
      return [];
    }

    switch (token) {
      case 'secret-admin-token':
        return ['admin'];
      case 'secret-user-token':
        return ['user'];
      default:
        return [];
    }
  }
}
