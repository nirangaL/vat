import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../common/services';
import { CreateClientDto, ClientListQueryDto, UpdateClientStatusDto } from './dto';
import { ClientStatus } from '@shared/core';

describe('ClientsService', () => {
  let service: ClientsService;
  let prisma: PrismaService;
  let auditLogService: AuditLogService;

  const mockPrisma = {
    client: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    submission: {
      count: jest.fn(),
    },
  };

  const mockAuditLogService = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditLogService, useValue: mockAuditLogService },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    prisma = module.get<PrismaService>(PrismaService);
    auditLogService = module.get<AuditLogService>(AuditLogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a client', async () => {
      const createClientDto: CreateClientDto = {
        company_name: 'Test Company',
        tin: '123456789V',
        taxable_period: 'quarterly' as any,
      };

      const expectedResult = {
        id: 'client-1',
        organization_id: 'org-123',
        ...createClientDto,
      };

      mockPrisma.client.create.mockResolvedValue(expectedResult);

      const result = await service.create('org-123', createClientDto, 'user-1');

      expect(result).toEqual(expectedResult);
      expect(mockPrisma.client.create).toHaveBeenCalledWith({
        data: {
          organization_id: 'org-123',
          ...createClientDto,
        },
      });
      expect(mockAuditLogService.log).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid TIN', async () => {
      const createClientDto: CreateClientDto = {
        company_name: 'Test Company',
        tin: 'INVALID',
      } as any;

      await expect(service.create('org-123', createClientDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException for duplicate TIN', async () => {
      const createClientDto: CreateClientDto = {
        company_name: 'Test Company',
        tin: '123456789V',
      } as any;

      const error = new Error('Unique constraint failed');
      (error as any).code = 'P2002';
      mockPrisma.client.create.mockRejectedValue(error);

      await expect(service.create('org-123', createClientDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated list of clients', async () => {
      const query: ClientListQueryDto = {
        page: 1,
        limit: 10,
      };

      const clients = [
        { id: 'client-1', company_name: 'Client 1' },
        { id: 'client-2', company_name: 'Client 2' },
      ];

      mockPrisma.client.findMany.mockResolvedValue(clients);
      mockPrisma.client.count.mockResolvedValue(2);

      const result = await service.findAll('org-123', query);

      expect(result.items).toEqual(clients);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    it('should filter by status', async () => {
      const query: ClientListQueryDto = {
        status: ClientStatus.ACTIVE,
      };

      mockPrisma.client.findMany.mockResolvedValue([]);
      mockPrisma.client.count.mockResolvedValue(0);

      await service.findAll('org-123', query);

      expect(mockPrisma.client.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: ClientStatus.ACTIVE,
          }),
        }),
      );
    });

    it('should filter by search term', async () => {
      const query: ClientListQueryDto = {
        search: 'Test',
      };

      mockPrisma.client.findMany.mockResolvedValue([]);
      mockPrisma.client.count.mockResolvedValue(0);

      await service.findAll('org-123', query);

      expect(mockPrisma.client.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({ company_name: expect.any(Object) }),
              expect.objectContaining({ tin: expect.any(Object) }),
            ]),
          }),
        }),
      );
    });
  });

  describe('findById', () => {
    it('should return client by ID', async () => {
      const client = { id: 'client-1', company_name: 'Test Client' };

      mockPrisma.client.findUnique.mockResolvedValue(client);

      const result = await service.findById('org-123', 'client-1');

      expect(result).toEqual(client);
      expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({
        where: { id: 'client-1', organization_id: 'org-123' },
      });
    });

    it('should throw NotFoundException if client not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValue(null);

      await expect(service.findById('org-123', 'nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const existingClient = { id: 'client-1', company_name: 'Old Name', tin: '123456789V' };
      const updateDto = { company_name: 'New Name' };
      const updatedClient = { ...existingClient, ...updateDto };

      mockPrisma.client.findFirst.mockResolvedValue(existingClient);
      mockPrisma.client.update.mockResolvedValue(updatedClient);

      const result = await service.update('org-123', 'client-1', updateDto, 'user-1');

      expect(result.company_name).toBe('New Name');
      expect(mockAuditLogService.log).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid TIN', async () => {
      const existingClient = { id: 'client-1', company_name: 'Test', tin: '123456789V' };
      const updateDto = { tin: 'INVALID' };

      mockPrisma.client.findFirst.mockResolvedValue(existingClient);

      await expect(service.update('org-123', 'client-1', updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException for duplicate TIN', async () => {
      const existingClient = { id: 'client-1', company_name: 'Test', tin: '123456789V' };
      const updateDto = { tin: '987654321V' };

      const error = new Error('Unique constraint failed');
      (error as any).code = 'P2002';
      mockPrisma.client.findFirst.mockResolvedValue(existingClient);
      mockPrisma.client.update.mockRejectedValue(error);

      await expect(service.update('org-123', 'client-1', updateDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should update client status', async () => {
      const client = { id: 'client-1', company_name: 'Test', status: ClientStatus.ACTIVE };
      const statusDto: UpdateClientStatusDto = { status: ClientStatus.SUSPENDED };
      const updatedClient = { ...client, status: ClientStatus.SUSPENDED };

      mockPrisma.client.findFirst.mockResolvedValue(client);
      mockPrisma.client.update.mockResolvedValue(updatedClient);

      const result = await service.updateStatus('org-123', 'client-1', statusDto, 'user-1');

      expect(result.status).toBe(ClientStatus.SUSPENDED);
      expect(mockAuditLogService.log).toHaveBeenCalled();
    });

    it('should throw NotFoundException if client not found', async () => {
      mockPrisma.client.findFirst.mockResolvedValue(null);

      await expect(
        service.updateStatus('org-123', 'nonexistent', { status: ClientStatus.INACTIVE }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('softDelete', () => {
    it('should delete a client', async () => {
      const client = { id: 'client-1', company_name: 'Test' };

      mockPrisma.client.findFirst.mockResolvedValue(client);
      mockPrisma.client.delete.mockResolvedValue(client);

      const result = await service.softDelete('org-123', 'client-1', 'user-1');

      expect(result.message).toBe('Client deleted successfully');
      expect(mockAuditLogService.log).toHaveBeenCalled();
    });

    it('should throw NotFoundException if client not found', async () => {
      mockPrisma.client.findFirst.mockResolvedValue(null);

      await expect(service.softDelete('org-123', 'nonexistent', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getSubmissionCount', () => {
    it('should return submission counts for client', async () => {
      const client = { id: 'client-1', company_name: 'Test Client' };

      mockPrisma.client.findFirst.mockResolvedValue(client);
      mockPrisma.submission.count.mockResolvedValueOnce(10).mockResolvedValueOnce(3);

      const result = await service.getSubmissionCount('org-123', 'client-1');

      expect(result.clientId).toBe('client-1');
      expect(result.clientName).toBe('Test Client');
      expect(result.totalSubmissions).toBe(10);
      expect(result.activeSubmissions).toBe(3);
    });

    it('should throw NotFoundException if client not found', async () => {
      mockPrisma.client.findFirst.mockResolvedValue(null);

      await expect(service.getSubmissionCount('org-123', 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('bulkImport', () => {
    it('should import clients from CSV', async () => {
      const csvData =
        'company_name,tin,taxable_period\nClient 1,123456789V,quarterly\nClient 2,987654321V,monthly';

      mockPrisma.client.create.mockResolvedValue({ id: 'new-client' });

      jest.spyOn(service, 'create').mockResolvedValue({} as any);

      const result = await service.bulkImport('org-123', csvData, 'user-1');

      expect(result.imported).toBeGreaterThan(0);
      expect(mockAuditLogService.log).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid CSV', async () => {
      const csvData = 'only_header';

      await expect(service.bulkImport('org-123', csvData)).rejects.toThrow(BadRequestException);
    });

    it('should handle import errors gracefully', async () => {
      const csvData = 'company_name,tin\nClient 1,123456789V\nClient 2,INVALID';

      jest.spyOn(service, 'create').mockImplementation(async (orgId, dto, userId) => {
        if (dto.tin === 'INVALID') {
          throw new BadRequestException('Invalid TIN');
        }
        return {} as any;
      });

      const result = await service.bulkImport('org-123', csvData, 'user-1');

      expect(result.failed).toBeGreaterThan(0);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('export', () => {
    it('should export clients as CSV', async () => {
      const clients = [
        {
          id: 'client-1',
          company_name: 'Client 1',
          tin: '123456789V',
          registration_number: 'PV123',
          taxable_period: 'quarterly',
          status: 'active',
          industry: 'Tech',
          annual_turnover: '10M',
          created_at: new Date('2024-01-01'),
        },
      ];

      mockPrisma.client.findMany.mockResolvedValue(clients);

      const result = await service.export('org-123');

      expect(result).toContain('company_name,tin,registration_number');
      expect(result).toContain('Client 1');
      expect(result).toContain('123456789V');
    });

    it('should throw NotFoundException if no clients', async () => {
      mockPrisma.client.findMany.mockResolvedValue([]);

      await expect(service.export('org-123')).rejects.toThrow(NotFoundException);
    });
  });
});
