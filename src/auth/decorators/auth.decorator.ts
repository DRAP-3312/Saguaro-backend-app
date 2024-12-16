import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRole } from '../interfaces/roles-protect.interface';
import { RoleProtected } from './';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function AuthProtected(...roles: ValidRole[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
