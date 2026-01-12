import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CurrentUser as CurrentUserInterface } from '@shared/core';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as CurrentUserInterface | undefined;
    const organizationId = request.organization_id || user?.organizationId;
    return typeof organizationId === 'string' && organizationId.length > 0;
  }
}
