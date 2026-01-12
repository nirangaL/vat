import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { UserRole, validateTIN, SubscriptionPlan, SubscriptionStatus } from '@shared/core';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { AuditLogService } from '../../common/services';
import {
  RegisterTenantDto,
  UpdateTenantDto,
  InviteUserDto,
  UpdateUserRoleDto,
  UpdateSubscriptionDto,
  TenantListQueryDto,
  OrganizationMetricsResponseDto,
} from './dto';

@Injectable()
export class TenantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async register(dto: RegisterTenantDto) {
    if (!validateTIN(dto.tin)) {
      throw new BadRequestException('Invalid TIN format');
    }

    const admin = this.supabaseService.getAdminClient();
    const passwordHash = await bcrypt.hash(dto.password, 10);

    try {
      return await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

        await this.auditLogService.log({
          organization_id: organization.id,
          entity_type: 'Organization',
          entity_id: organization.id,
          action: 'create',
          user_id: user.id,
          changes: { name: dto.name, email: dto.email },
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
    const organization = await this.prisma.organization.update({
      where: { id: organizationId },
      data: dto,
    });

    await this.auditLogService.log({
      organization_id: organizationId,
      entity_type: 'Organization',
      entity_id: organizationId,
      action: 'update',
      changes: dto,
    });

    return organization;
  }

  async findById(organizationId: string, requestingUserId?: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    await this.auditLogService.log({
      organization_id: requestingUserId ? organizationId : organizationId,
      entity_type: 'Organization',
      entity_id: organizationId,
      action: 'update',
      user_id: requestingUserId,
      changes: { action: 'view' },
    });

    return organization;
  }

  async findAll(query: TenantListQueryDto) {
    const { page = 1, limit = 10, search, subscription_plan, subscription_status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.OrganizationWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (subscription_plan) {
      where.subscription_plan = subscription_plan;
    }

    if (subscription_status) {
      where.subscription_status = subscription_status;
    }

    const [organizations, total] = await Promise.all([
      this.prisma.organization.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.organization.count({ where }),
    ]);

    return {
      items: organizations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async softDelete(organizationId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    await this.auditLogService.log({
      organization_id: organizationId,
      entity_type: 'Organization',
      entity_id: organizationId,
      action: 'delete',
      changes: { name: organization.name },
    });

    await this.prisma.organization.delete({
      where: { id: organizationId },
    });

    return { message: 'Organization deleted successfully' };
  }

  async getMetrics(organizationId: string): Promise<OrganizationMetricsResponseDto> {
    const [totalUsers, totalClients, totalSubmissions, activeSubmissions, organization] =
      await Promise.all([
        this.prisma.user.count({
          where: { organization_id: organizationId },
        }),
        this.prisma.client.count({
          where: { organization_id: organizationId },
        }),
        this.prisma.submission.count({
          where: { organization_id: organizationId },
        }),
        this.prisma.submission.count({
          where: {
            organization_id: organizationId,
            status: { in: ['draft', 'submitted'] },
          },
        }),
        this.prisma.organization.findUnique({
          where: { id: organizationId },
          select: {
            subscription_plan: true,
            subscription_status: true,
          },
        }),
      ]);

    return {
      totalUsers,
      totalClients,
      totalSubmissions,
      activeSubmissions,
      subscriptionPlan: organization?.subscription_plan as SubscriptionPlan,
      subscriptionStatus: organization?.subscription_status as SubscriptionStatus,
    };
  }

  async getUsers(organizationId: string) {
    const users = await this.prisma.user.findMany({
      where: { organization_id: organizationId },
      select: {
        id: true,
        email: true,
        full_name: true,
        role: true,
        is_active: true,
        is_team_member: true,
        created_at: true,
        last_login: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return users;
  }

  async addUser(organizationId: string, inviteDto: InviteUserDto, inviterUserId: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        organization_id: organizationId,
        email: inviteDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists in organization');
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(tempPassword, 10);
    const admin = this.supabaseService.getAdminClient();

    const user = await this.prisma.$transaction(async (tx) => {
      const { data: authCreated, error: authError } = await admin.auth.admin.createUser({
        email: inviteDto.email,
        password: tempPassword,
        email_confirm: true,
        app_metadata: {
          organization_id: organizationId,
          role: inviteDto.role,
        },
      });

      if (authError || !authCreated?.user) {
        throw new BadRequestException(authError?.message ?? 'User creation failed in Supabase');
      }

      const newUser = await tx.user.create({
        data: {
          id: authCreated.user.id,
          organization_id: organizationId,
          email: inviteDto.email,
          password_hash: passwordHash,
          role: inviteDto.role,
          is_team_member: true,
          is_active: true,
        },
      });

      await this.auditLogService.log({
        organization_id: organizationId,
        entity_type: 'User',
        entity_id: newUser.id,
        action: 'create',
        user_id: inviterUserId,
        changes: { email: inviteDto.email, role: inviteDto.role },
      });

      return newUser;
    });

    return {
      user,
      tempPassword,
      message: 'User added successfully. Temporary password sent to email.',
    };
  }

  async removeUser(organizationId: string, userId: string, removerUserId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        organization_id: organizationId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found in organization');
    }

    await this.auditLogService.log({
      organization_id: organizationId,
      entity_type: 'User',
      entity_id: userId,
      action: 'delete',
      user_id: removerUserId,
      changes: { email: user.email, role: user.role },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        is_active: false,
        email: `deleted_${userId}_${Date.now()}@deleted.local`,
      },
    });

    const admin = this.supabaseService.getAdminClient();
    await admin.auth.admin.deleteUser(userId);

    return { message: 'User removed successfully' };
  }

  async updateUserRole(
    organizationId: string,
    userId: string,
    updateDto: UpdateUserRoleDto,
    updaterUserId: string,
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        organization_id: organizationId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found in organization');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: updateDto.role },
    });

    const admin = this.supabaseService.getAdminClient();
    await admin.auth.admin.updateUserById(userId, {
      app_metadata: {
        organization_id: organizationId,
        role: updateDto.role,
      },
    });

    await this.auditLogService.log({
      organization_id: organizationId,
      entity_type: 'User',
      entity_id: userId,
      action: 'update',
      user_id: updaterUserId,
      changes: { email: user.email, previousRole: user.role, newRole: updateDto.role },
    });

    return updatedUser;
  }

  async updateSubscription(
    organizationId: string,
    updateDto: UpdateSubscriptionDto,
    updaterUserId: string,
  ) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        subscription_plan: true,
        subscription_status: true,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    if (updateDto.subscription_status) {
      const allowedTransitions: Record<string, string[]> = {
        trial: ['active', 'suspended', 'cancelled'],
        active: ['suspended', 'cancelled'],
        suspended: ['active', 'cancelled'],
        cancelled: [],
      };

      if (
        !allowedTransitions[organization.subscription_status]?.includes(
          updateDto.subscription_status,
        )
      ) {
        throw new BadRequestException(
          `Cannot transition from ${organization.subscription_status} to ${updateDto.subscription_status}`,
        );
      }
    }

    const updatedOrganization = await this.prisma.organization.update({
      where: { id: organizationId },
      data: updateDto,
    });

    await this.auditLogService.log({
      organization_id: organizationId,
      entity_type: 'Organization',
      entity_id: organizationId,
      action: 'update',
      user_id: updaterUserId,
      changes: {
        previous: {
          subscription_plan: organization.subscription_plan,
          subscription_status: organization.subscription_status,
        },
        new: updateDto,
      },
    });

    return updatedOrganization;
  }

  async getSubscription(organizationId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        subscription_plan: true,
        subscription_status: true,
        stripe_customer_id: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }
}
