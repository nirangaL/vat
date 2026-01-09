import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@shared/constants';
import { validateTIN } from '@shared/validators';
import { SupabaseService } from '../../supabase/supabase.service';
import { RegisterTenantDto, UpdateTenantDto } from './dto';

@Injectable()
export class TenantsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async register(dto: RegisterTenantDto) {
    if (!validateTIN(dto.tin)) {
      throw new BadRequestException('Invalid TIN format');
    }

    const admin = this.supabaseService.getAdminClient();

    const { data: tenant, error: tenantError } = await admin
      .from('tenants')
      .insert({
        name: dto.name,
        registration_number: dto.registration_number,
        tin: dto.tin,
        email: dto.email,
      })
      .select('*')
      .single();

    if (tenantError) {
      const msg = tenantError.message ?? 'Tenant creation failed';
      if (msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('unique')) {
        throw new ConflictException(msg);
      }
      throw new BadRequestException(msg);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const { data: authCreated, error: authError } =
      await admin.auth.admin.createUser({
        email: dto.email,
        password: dto.password,
        email_confirm: true,
        user_metadata: {
          full_name: dto.admin_full_name,
        },
        app_metadata: {
          tenant_id: tenant.id,
          role: UserRole.VAT_TEAM_LEAD,
        },
      });

    if (authError || !authCreated?.user) {
      await admin.from('tenants').delete().eq('id', tenant.id);
      throw new BadRequestException(authError?.message ?? 'Admin user creation failed');
    }

    const { error: dbUserError } = await admin.from('users').insert({
      id: authCreated.user.id,
      tenant_id: tenant.id,
      email: dto.email,
      password_hash: passwordHash,
      full_name: dto.admin_full_name,
      role: UserRole.VAT_TEAM_LEAD,
      is_team_member: true,
      two_fa_enabled: false,
    });

    if (dbUserError) {
      this.supabaseService.handleError(dbUserError);
    }

    const { error: brandingError } = await admin.from('branding').insert({
      tenant_id: tenant.id,
      company_name: dto.name,
      support_email: dto.email,
      enabled: true,
    });

    if (brandingError) {
      this.supabaseService.handleError(brandingError);
    }

    return {
      tenant,
      adminUserId: authCreated.user.id,
    };
  }

  async findMe(tenantId: string, accessToken: string) {
    const client = this.supabaseService.createUserClient(accessToken);

    const { data, error } = await client
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single();

    if (error) {
      this.supabaseService.handleError(error);
    }

    if (!data) {
      throw new NotFoundException('Tenant not found');
    }

    return data;
  }

  async updateMe(tenantId: string, accessToken: string, dto: UpdateTenantDto) {
    const client = this.supabaseService.createUserClient(accessToken);

    const { data, error } = await client
      .from('tenants')
      .update({
        ...dto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tenantId)
      .select('*')
      .single();

    if (error) {
      this.supabaseService.handleError(error);
    }

    return data;
  }
}
