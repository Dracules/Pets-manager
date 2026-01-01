import { UserRole } from 'src/shared/types/userRole.type';

export interface JwtPayload {
  sub: string;
  username: string;
  roles: UserRole[] | undefined;
}
