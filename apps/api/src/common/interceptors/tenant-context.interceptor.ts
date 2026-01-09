import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const organization_id = request.organization_id || request.user?.organization_id;

    // Store in global context for Prisma middleware to access
    if (organization_id) {
      (global as any).organizationId = organization_id;
    }

    return next.handle();
  }
}
