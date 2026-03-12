import { Reflector } from '@nestjs/core';
import { UserRole } from '../types/userRole.type';

export const Roles = Reflector.createDecorator<UserRole[]>();
