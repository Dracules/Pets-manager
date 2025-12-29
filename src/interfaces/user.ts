import { UserRole } from 'src/types/userRole.type';

export interface User {
  id: string;
  login: string;
  password: string;
  roles: UserRole[];
}
