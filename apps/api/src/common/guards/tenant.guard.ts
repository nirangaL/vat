import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const organizationId = request.organization_id || request.user?.organization_id;
    return typeof organizationId === 'string' && organizationId.length > 0;
  }
}
