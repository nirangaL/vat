import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  override handleRequest(err: unknown, user: any) {
    if (err) {
      throw err;
    }

    if (!user) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return user;
  }
}
