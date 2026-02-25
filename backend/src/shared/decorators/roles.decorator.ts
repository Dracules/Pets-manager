import { Reflector } from '@nestjs/core';
import { UserRole } from '../../shared/types/userRole.type';

export const Roles = Reflector.createDecorator<UserRole[]>();
