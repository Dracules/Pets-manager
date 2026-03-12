import { UserRole } from '../../shared/types/userRole.type';

export interface JwtPayload {
  sub: string;
  username: string;
  roles: UserRole[] | undefined;
}
