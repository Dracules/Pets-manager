import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from 'src/decorators/roles.decorator';
import { RequestWithUser } from 'src/interfaces/request-with-user';
import { UserRole } from 'src/types/userRole.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    return this.matchRoles(roles, user.roles);
  }

  matchRoles(handlerRoles: UserRole[], userRoles: UserRole[]): boolean {
    return handlerRoles.some((role) => userRoles.includes(role));
  }
}
