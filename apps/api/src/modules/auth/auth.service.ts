import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SupabaseService } from '../../supabase/supabase.service';
import { LoginDto, RegisterUserDto } from './dto';
import { UserRole } from '@shared/constants';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async login(loginDto: LoginDto) {
    const supabase = this.supabaseService.getAnonClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginDto.email,
      password: loginDto.password,
    });

    if (error || !data.session || !data.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const admin = this.supabaseService.getAdminClient();
    const { data: dbUser, error: dbUserError } = await admin
      .from('users')
      .select('tenant_id, role, full_name, is_team_member')
      .eq('id', data.user.id)
      .maybeSingle();

    if (dbUserError) {
      this.supabaseService.handleError(dbUserError);
    }

    const tenantId =
      (dbUser?.tenant_id as string | undefined) ??
      (data.user.app_metadata?.tenant_id as string | undefined);

    const role =
      (dbUser?.role as UserRole | undefined) ??
      (data.user.app_metadata?.role as UserRole | undefined) ??
      UserRole.CLIENT;

    if (!tenantId) {
      throw new UnauthorizedException('User missing tenant context');
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      tenantId,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: dbUser?.full_name,
        role,
        tenantId,
        isTeamMember: dbUser?.is_team_member,
      },
    };
  }

  async registerUser(currentTenantId: string, dto: RegisterUserDto) {
    const admin = this.supabaseService.getAdminClient();

    const role = dto.role ?? UserRole.VAT_TEAM_MEMBER;

    const { data: created, error: createError } =
      await admin.auth.admin.createUser({
        email: dto.email,
        password: dto.password,
        email_confirm: true,
        user_metadata: {
          full_name: dto.full_name,
        },
        app_metadata: {
          tenant_id: currentTenantId,
          role,
        },
      });

    if (createError || !created?.user) {
      throw new BadRequestException(createError?.message ?? 'User creation failed');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const { data: dbUser, error: dbInsertError } = await admin
      .from('users')
      .insert({
        id: created.user.id,
        tenant_id: currentTenantId,
        email: dto.email,
        password_hash: passwordHash,
        full_name: dto.full_name,
        role,
        is_team_member: true,
        two_fa_enabled: false,
      })
      .select('id, tenant_id, email, full_name, role, is_team_member')
      .single();

    if (dbInsertError) {
      this.supabaseService.handleError(dbInsertError);
    }

    return dbUser;
  }
}
