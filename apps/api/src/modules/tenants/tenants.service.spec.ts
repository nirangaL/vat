import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { AuditLogService } from '../../common/services';
import { UserRole } from '@shared/core';
import { InviteUserDto, UpdateSubscriptionDto, TenantListQueryDto } from './dto';
import * as bcrypt from 'bcrypt';

describe('TenantsService', () => {
  let service: TenantsService;
  let prisma: PrismaService;
  let supabaseService: SupabaseService;
  let auditLogService: AuditLogService;

  const mockPrisma = {
    organization: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    client: {
      count: jest.fn(),
    },
    submission: {
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockSupabaseService = {
    getAdminClient: jest.fn(() => ({
      auth: {
        admin: {
          createUser: jest.fn(),
          updateUserById: jest.fn(),
          deleteUser: jest.fn(),
        },
      },
    })),
  };

  const mockAuditLogService = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: AuditLogService, useValue: mockAuditLogService },
      ],
    }).compile();

    service = module.get<TenantsService>(TenantsService);
    prisma = module.get<PrismaService>(PrismaService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
    auditLogService = module.get<AuditLogService>(AuditLogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findMe', () => {
    it('should return current tenant', async () => {
      const expectedTenant = {
        id: 'org-123',
        name: 'Test Tenant',
      };

      mockPrisma.organization.findUnique.mockResolvedValue(expectedTenant);

      const result = await service.findMe('org-123');

      expect(result).toEqual(expectedTenant);
      expect(mockPrisma.organization.findUnique).toHaveBeenCalledWith({
        where: { id: 'org-123' },
      });
    });
  });

  describe('updateMe', () => {
    it('should update current tenant', async () => {
      const updateDto = { name: 'Updated Tenant' };
      const expectedTenant = { id: 'org-123', ...updateDto };

      mockPrisma.organization.update.mockResolvedValue(expectedTenant);

      const result = await service.updateMe('org-123', updateDto);

      expect(result).toEqual(expectedTenant);
      expect(mockPrisma.organization.update).toHaveBeenCalledWith({
        where: { id: 'org-123' },
        data: updateDto,
      });
      expect(mockAuditLogService.log).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return tenant by ID', async () => {
      const expectedTenant = {
        id: 'org-123',
        name: 'Test Tenant',
      };

      mockPrisma.organization.findUnique.mockResolvedValue(expectedTenant);

      const result = await service.findById('org-123');

      expect(result).toEqual(expectedTenant);
      expect(mockAuditLogService.log).toHaveBeenCalled();
    });

    it('should throw NotFoundException if tenant not found', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated list of tenants', async () => {
      const query: TenantListQueryDto = {
        page: 1,
        limit: 10,
      };

      const tenants = [
        { id: 'org-1', name: 'Tenant 1' },
        { id: 'org-2', name: 'Tenant 2' },
      ];

      mockPrisma.organization.findMany.mockResolvedValue(tenants);
      mockPrisma.organization.count.mockResolvedValue(2);

      const result = await service.findAll(query);

      expect(result.items).toEqual(tenants);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    it('should filter by subscription plan', async () => {
      const query: TenantListQueryDto = {
        subscription_plan: 'professional' as any,
      };

      mockPrisma.organization.findMany.mockResolvedValue([]);
      mockPrisma.organization.count.mockResolvedValue(0);

      await service.findAll(query);

      expect(mockPrisma.organization.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            subscription_plan: 'professional',
          }),
        }),
      );
    });
  });

  describe('getMetrics', () => {
    it('should return organization metrics', async () => {
      const expectedMetrics = {
        totalUsers: 5,
        totalClients: 42,
        totalSubmissions: 156,
        activeSubmissions: 23,
        subscriptionPlan: 'professional',
        subscriptionStatus: 'active',
      };

      mockPrisma.user.count.mockResolvedValue(expectedMetrics.totalUsers);
      mockPrisma.client.count.mockResolvedValue(expectedMetrics.totalClients);
      mockPrisma.submission.count
        .mockResolvedValueOnce(expectedMetrics.totalSubmissions)
        .mockResolvedValueOnce(expectedMetrics.activeSubmissions);
      mockPrisma.organization.findUnique.mockResolvedValue({
        subscription_plan: expectedMetrics.subscriptionPlan,
        subscription_status: expectedMetrics.subscriptionStatus,
      });

      const result = await service.getMetrics('org-123');

      expect(result).toEqual(expectedMetrics);
    });
  });

  describe('getUsers', () => {
    it('should return organization users', async () => {
      const users = [
        {
          id: 'user-1',
          email: 'user1@test.com',
          role: UserRole.VAT_TEAM_MEMBER,
        },
      ];

      mockPrisma.user.findMany.mockResolvedValue(users);

      const result = await service.getUsers('org-123');

      expect(result).toEqual(users);
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: { organization_id: 'org-123' },
        select: expect.any(Object),
        orderBy: { created_at: 'desc' },
      });
    });
  });

  describe('addUser', () => {
    it('should add user to organization', async () => {
      const inviteDto: InviteUserDto = {
        email: 'newuser@test.com',
        role: UserRole.VAT_TEAM_MEMBER,
      };

      const newUser = {
        id: 'user-new',
        email: inviteDto.email,
        role: inviteDto.role,
      };

      mockPrisma.user.findFirst.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(newUser);

      const mockAdminClient = {
        auth: {
          admin: {
            createUser: jest.fn().mockResolvedValue({
              data: { user: { id: newUser.id } },
              error: null,
            }),
            updateUserById: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      };

      mockSupabaseService.getAdminClient.mockReturnValue(mockAdminClient);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = {
          user: { create: mockPrisma.user.create },
        };
        return callback(tx);
      });

      const result = await service.addUser('org-123', inviteDto, 'inviter-id');

      expect(result.user).toEqual(newUser);
      expect(mockAuditLogService.log).toHaveBeenCalled();
    });

    it('should throw ConflictException if user exists', async () => {
      const inviteDto: InviteUserDto = {
        email: 'existing@test.com',
        role: UserRole.VAT_TEAM_MEMBER,
      };

      mockPrisma.user.findFirst.mockResolvedValue({
        id: 'user-1',
        email: inviteDto.email,
      });

      await expect(service.addUser('org-123', inviteDto, 'inviter-id')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateUserRole', () => {
    it('should update user role', async () => {
      const user = { id: 'user-1', email: 'user@test.com', role: UserRole.VAT_TEAM_MEMBER };
      const updatedUser = { ...user, role: UserRole.VAT_TEAM_LEAD };

      mockPrisma.user.findFirst.mockResolvedValue(user);
      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateUserRole(
        'org-123',
        'user-1',
        { role: UserRole.VAT_TEAM_LEAD },
        'admin-id',
      );

      expect(result.role).toBe(UserRole.VAT_TEAM_LEAD);
      expect(mockAuditLogService.log).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);

      await expect(
        service.updateUserRole(
          'org-123',
          'nonexistent',
          { role: UserRole.VAT_TEAM_LEAD },
          'admin-id',
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeUser', () => {
    it('should remove user from organization', async () => {
      const user = { id: 'user-1', email: 'user@test.com', role: UserRole.VAT_TEAM_MEMBER };

      mockPrisma.user.findFirst.mockResolvedValue(user);
      mockPrisma.user.update.mockResolvedValue({ ...user, is_active: false });

      const result = await service.removeUser('org-123', 'user-1', 'admin-id');

      expect(result.message).toBe('User removed successfully');
      expect(mockAuditLogService.log).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);

      await expect(service.removeUser('org-123', 'nonexistent', 'admin-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateSubscription', () => {
    it('should update subscription', async () => {
      const updateDto: UpdateSubscriptionDto = {
        subscription_status: 'active' as any,
      };

      const organization = {
        subscription_plan: 'trial',
        subscription_status: 'trial',
      };

      const updatedOrganization = {
        ...organization,
        ...updateDto,
      };

      mockPrisma.organization.findUnique.mockResolvedValue(organization);
      mockPrisma.organization.update.mockResolvedValue(updatedOrganization);

      const result = await service.updateSubscription('org-123', updateDto, 'admin-id');

      expect(result).toEqual(updatedOrganization);
      expect(mockAuditLogService.log).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid transition', async () => {
      const updateDto: UpdateSubscriptionDto = {
        subscription_status: 'trial' as any,
      };

      mockPrisma.organization.findUnique.mockResolvedValue({
        subscription_plan: 'basic',
        subscription_status: 'cancelled',
      });

      await expect(service.updateSubscription('org-123', updateDto, 'admin-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getSubscription', () => {
    it('should return subscription details', async () => {
      const subscription = {
        subscription_plan: 'professional',
        subscription_status: 'active',
        stripe_customer_id: 'cus_123',
      };

      mockPrisma.organization.findUnique.mockResolvedValue(subscription);

      const result = await service.getSubscription('org-123');

      expect(result).toEqual(subscription);
    });

    it('should throw NotFoundException if organization not found', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue(null);

      await expect(service.getSubscription('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('softDelete', () => {
    it('should delete organization', async () => {
      const organization = { id: 'org-123', name: 'Test Tenant' };

      mockPrisma.organization.findUnique.mockResolvedValue(organization);
      mockPrisma.organization.delete.mockResolvedValue(organization);

      const result = await service.softDelete('org-123');

      expect(result.message).toBe('Organization deleted successfully');
      expect(mockAuditLogService.log).toHaveBeenCalled();
    });

    it('should throw NotFoundException if organization not found', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue(null);

      await expect(service.softDelete('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
