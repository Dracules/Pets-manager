import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/types/userRole.type';

export const Roles = Reflector.createDecorator<UserRole[]>();
