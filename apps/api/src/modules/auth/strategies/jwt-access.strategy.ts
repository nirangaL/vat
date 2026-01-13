import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { CurrentUser, UserRole } from '@shared/core';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from '../../../prisma/prisma.service';

export type JwtAccessPayload = {
  sub: string;
};

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtAccessPayload): Promise<CurrentUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        full_name: true,
        role: true,
        organization_id: true,
        is_team_member: true,
        is_active: true,
        two_fa_enabled: true,
        last_login: true,
      },
    });

    if (!user || !user.is_active) {
      throw new UnauthorizedException('Invalid or inactive user');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name ?? undefined,
      organizationId: user.organization_id,
      role: user.role as UserRole,
      isTeamMember: user.is_team_member,
      isActive: user.is_active,
      twoFaEnabled: user.two_fa_enabled,
      lastLogin: user.last_login ?? undefined,
    };
  }
}
