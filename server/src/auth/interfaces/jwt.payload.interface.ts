import { type UserRole } from '../../shared/types/userRole.type';

export interface RefreshJwtPayload {
  sub: string;
}

export interface AccessJwtPayload {
  sub: string;
  username: string;
  roles: UserRole[] | undefined;
}
