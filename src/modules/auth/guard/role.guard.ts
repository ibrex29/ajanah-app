import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLE_KEY } from '../../../common/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // If no roles are required, allow access
    }

    const gqlContext = GqlExecutionContext.create(context);
    const user = gqlContext.getContext().req.user; // Get user from GraphQL request

    if (!user?.roles?.length) {
      return false; // Deny access if the user has no roles
    }

    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
