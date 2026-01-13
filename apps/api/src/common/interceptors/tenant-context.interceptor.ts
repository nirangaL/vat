import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { CurrentUser } from '@shared/core';

declare global {
  var organizationId: string | undefined;
}

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request & { organization_id?: string }>();
    const user = request.user as CurrentUser | undefined;
    const organization_id = request.organization_id || user?.organizationId;

    // Store in global context for Prisma middleware to access
    if (organization_id) {
      global.organizationId = organization_id;
    }

    return next.handle();
  }
}
