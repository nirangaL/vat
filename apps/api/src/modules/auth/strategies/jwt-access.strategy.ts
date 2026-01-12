import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserRole } from '@shared/core';
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

  async validate(payload: JwtAccessPayload) {
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
      },
    });

    if (!user || !user.is_active) {
      throw new UnauthorizedException('Invalid or inactive user');
    }

    return {
      userId: user.id,
      email: user.email,
      fullName: user.full_name ?? undefined,
      role: user.role as UserRole,
      organization_id: user.organization_id,
      isTeamMember: user.is_team_member,
    };
  }
}
