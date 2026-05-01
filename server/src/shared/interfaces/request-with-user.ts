import { Request } from 'express';
import { AccessJwtPayload } from '../../auth/interfaces/jwt.payload.interface';

export interface RequestWithUser extends Request {
  user: AccessJwtPayload;
}
