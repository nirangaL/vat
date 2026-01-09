import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class PrismaTenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract organization_id from JWT token
    const organization_id = (req.user as any)?.organization_id;

    if (organization_id) {
      req.organization_id = organization_id;
    }

    next();
  }
}
