import { UserRole } from 'src/shared/types/userRole.type';

export interface User {
  id: string;
  login: string;
  password: string;
  roles?: UserRole[];
}
