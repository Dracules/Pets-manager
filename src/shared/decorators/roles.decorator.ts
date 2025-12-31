import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/shared/types/userRole.type';

export const Roles = Reflector.createDecorator<UserRole[]>();
