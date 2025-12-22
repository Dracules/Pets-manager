import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRole } from 'src/types/userRole.type';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const roles: UserRole[] = this.GetRole(request);

    request.user = {
      id: 1,
      name: 'Test User',
      roles,
    };

    return true;
  }

  GetRole(request: any): UserRole[] {
    const authHeader = request.headers['authorization'] as string | undefined;

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
