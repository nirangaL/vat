import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@shared/core';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { LoginDto, RegisterUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async signAccessToken(userId: string): Promise<string> {
    const expiresIn = this.configService.get<string>('jwt.expiresIn') ?? '15m';

    return this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn,
      },
    );
  }

  private async signRefreshToken(userId: string): Promise<string> {
    const expiresIn = this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d';

    return this.jwtService.signAsync(
      { sub: userId },
      {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn,
      },
    );
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string | null): Promise<void> {
    const refresh_token_hash = refreshToken ? await bcrypt.hash(refreshToken, 10) : null;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refresh_token_hash,
      },
    });
  }

  async login(loginDto: LoginDto) {
    const supabase = this.supabaseService.getAnonClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginDto.email,
      password: loginDto.password,
    });

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: data.user.id },
      select: {
        id: true,
        organization_id: true,
        role: true,
        full_name: true,
        is_team_member: true,
        is_active: true,
      },
    });

    const organizationId =
      dbUser?.organization_id ??
      (data.user.app_metadata?.organization_id as string | undefined) ??
      (data.user.app_metadata?.tenant_id as string | undefined);

    const role =
      (dbUser?.role as UserRole | undefined) ??
      (data.user.app_metadata?.role as UserRole | undefined) ??
      UserRole.CLIENT;

    if (!organizationId) {
      throw new UnauthorizedException('User missing organization context');
    }

    if (!dbUser) {
      throw new UnauthorizedException('User not found in tenant database');
    }

    if (!dbUser.is_active) {
      throw new UnauthorizedException('User account is inactive');
    }

    const accessToken = await this.signAccessToken(dbUser.id);
    const refreshToken = await this.signRefreshToken(dbUser.id);

    await this.prisma.user.update({
      where: { id: dbUser.id },
      data: {
        last_login: new Date(),
      },
    });

    await this.updateRefreshTokenHash(dbUser.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      organizationId,
      user: {
        id: dbUser.id,
        email: data.user.email,
        fullName: dbUser.full_name ?? undefined,
        role,
        organizationId,
        isTeamMember: dbUser.is_team_member,
      },
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        refresh_token_hash: true,
        is_active: true,
      },
    });

    if (!user || !user.is_active) {
      throw new UnauthorizedException('Invalid or inactive user');
    }

    if (!user.refresh_token_hash) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    const tokenMatches = await bcrypt.compare(refreshToken, user.refresh_token_hash);

    if (!tokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newAccessToken = await this.signAccessToken(user.id);
    const newRefreshToken = await this.signRefreshToken(user.id);

    await this.updateRefreshTokenHash(user.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string) {
    await this.updateRefreshTokenHash(userId, null);

    return {
      success: true,
    };
  }

  async registerUser(currentOrganizationId: string, dto: RegisterUserDto) {
    const admin = this.supabaseService.getAdminClient();
    const role = dto.role ?? UserRole.VAT_TEAM_MEMBER;

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      email_confirm: true,
      user_metadata: {
        full_name: dto.full_name,
      },
      app_metadata: {
        organization_id: currentOrganizationId,
        role,
      },
    });

    if (createError || !created?.user) {
      throw new BadRequestException(createError?.message ?? 'User creation failed');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    try {
      return await this.prisma.user.create({
        data: {
          id: created.user.id,
          organization_id: currentOrganizationId,
          email: dto.email,
          password_hash: passwordHash,
          full_name: dto.full_name,
          role,
          is_team_member: true,
          two_fa_enabled: false,
          refresh_token_hash: null,
        },
        select: {
          id: true,
          organization_id: true,
          email: true,
          full_name: true,
          role: true,
          is_team_member: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message || 'Database creation failed');
    }
  }
}
