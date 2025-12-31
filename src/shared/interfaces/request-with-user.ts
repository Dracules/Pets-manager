import { Request } from 'express';
import { UserRole } from 'src/shared/types/userRole.type';

export interface RequestWithUser extends Request {
  user: {
    id: number;
    name: string;
    roles: UserRole[];
  };
}
