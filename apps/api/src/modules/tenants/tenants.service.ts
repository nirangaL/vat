import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { UserRole, validateTIN } from '@shared/core';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { RegisterTenantDto, UpdateTenantDto } from './dto';

@Injectable()
export class TenantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async register(dto: RegisterTenantDto) {
    if (!validateTIN(dto.tin)) {
      throw new BadRequestException('Invalid TIN format');
    }

    const admin = this.supabaseService.getAdminClient();
    const passwordHash = await bcrypt.hash(dto.password, 10);

    try {
      return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // 1. Create Organization in Prisma
        const organization = await tx.organization.create({
          data: {
            name: dto.name,
            slug: dto.name.toLowerCase().replace(/\s+/g, '-'),
            registration_number: dto.registration_number,
            tin: dto.tin,
            email: dto.email,
            branding: {
              create: {
                company_name: dto.name,
                support_email: dto.email,
                enabled: true,
              },
            },
          },
        });

        // 2. Create User in Supabase Auth
        const { data: authCreated, error: authError } = await admin.auth.admin.createUser({
          email: dto.email,
          password: dto.password,
          email_confirm: true,
          user_metadata: {
            full_name: dto.admin_full_name,
          },
          app_metadata: {
            organization_id: organization.id,
            role: UserRole.VAT_TEAM_LEAD,
          },
        });

        if (authError || !authCreated?.user) {
          throw new BadRequestException(
            authError?.message ?? 'Admin user creation failed in Supabase',
          );
        }

        // 3. Create User in Prisma
        const user = await tx.user.create({
          data: {
            id: authCreated.user.id,
            organization_id: organization.id,
            email: dto.email,
            password_hash: passwordHash,
            full_name: dto.admin_full_name,
            role: UserRole.VAT_TEAM_LEAD,
            is_team_member: true,
          },
        });

        return {
          tenant: organization,
          adminUserId: user.id,
        };
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Organization with this TIN or Email already exists');
      }
      throw new BadRequestException(error.message || 'Registration failed');
    }
  }

  async findMe(organizationId: string) {
    return this.prisma.organization.findUnique({
      where: { id: organizationId },
    });
  }

  async updateMe(organizationId: string, dto: UpdateTenantDto) {
    return this.prisma.organization.update({
      where: { id: organizationId },
      data: dto,
    });
  }
}
