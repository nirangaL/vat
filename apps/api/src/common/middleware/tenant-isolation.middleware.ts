import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

function decodeBase64Url(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(normalized + padding, 'base64').toString('utf8');
}

function decodeJwtPayload(token: string): Record<string, any> | null {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const json = decodeBase64Url(parts[1]);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

@Injectable()
export class TenantIsolationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;

    if (typeof authorization === 'string' && authorization.startsWith('Bearer ')) {
      const accessToken = authorization.slice('Bearer '.length);
      req.accessToken = accessToken;

      const payload = decodeJwtPayload(accessToken);
      const tenantId =
        payload?.app_metadata?.tenant_id ?? payload?.tenant_id ?? undefined;

      if (typeof tenantId === 'string') {
        req.tenantId = tenantId;
      }

      req.jwtPayload = payload ?? undefined;
    }

    next();
  }
}
