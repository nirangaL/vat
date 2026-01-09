import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SupabaseService } from '../../supabase/supabase.service';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto, RegisterUserDto } from './dto';
import { UserRole } from '@shared/core';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly prisma: PrismaService,
  ) {}

  async login(loginDto: LoginDto) {
    const supabase = this.supabaseService.getAnonClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginDto.email,
      password: loginDto.password,
    });

    if (error || !data.session || !data.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: data.user.id },
      select: { organization_id: true, role: true, full_name: true, is_team_member: true },
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

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      organizationId,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: dbUser?.full_name,
        role,
        organizationId,
        isTeamMember: dbUser?.is_team_member,
      },
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
