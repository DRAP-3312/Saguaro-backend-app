import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { Auth } from 'src/auth/entities/auth.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRole: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRole) return true;
    if (validRole.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as Auth;

    if (!user) throw new BadRequestException('User not found');
    if (validRole.includes(user.rol.name)) return true;

    throw new ForbiddenException(
      `User ${user.user.name} need role [${validRole}]`,
    );
  }
}
