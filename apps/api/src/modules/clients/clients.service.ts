import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { validateTIN, ClientStatus } from '@shared/core';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../common/services';
import { CreateClientDto, UpdateClientDto, UpdateClientStatusDto, ClientListQueryDto } from './dto';

@Injectable()
export class ClientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(organizationId: string, dto: CreateClientDto, userId?: string) {
    if (!validateTIN(dto.tin)) {
      throw new BadRequestException('Invalid TIN format');
    }

    try {
      const client = await this.prisma.client.create({
        data: {
          ...dto,
          organization_id: organizationId,
        },
      });

      await this.auditLogService.log({
        organization_id: organizationId,
        entity_type: 'Client',
        entity_id: client.id,
        action: 'create',
        user_id: userId,
        changes: { company_name: dto.company_name, tin: dto.tin },
      });

      return client;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Client with this TIN already exists');
      }
      throw new BadRequestException(error.message || 'Client creation failed');
    }
  }

  async findAll(organizationId: string, query?: ClientListQueryDto) {
    const { page = 1, limit = 10, search, status, taxable_period } = query || {};
    const skip = (page - 1) * limit;

    const where: Prisma.ClientWhereInput = {
      organization_id: organizationId,
    };

    if (search) {
      where.OR = [
        { company_name: { contains: search, mode: 'insensitive' } },
        { tin: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (taxable_period) {
      where.taxable_period = taxable_period;
    }

    const [clients, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.client.count({ where }),
    ]);

    return {
      items: clients,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(organizationId: string, id: string) {
    const client = await this.prisma.client.findUnique({
      where: {
        id,
        organization_id: organizationId,
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async update(organizationId: string, id: string, dto: UpdateClientDto, userId?: string) {
    try {
      const existingClient = await this.prisma.client.findFirst({
        where: {
          id,
          organization_id: organizationId,
        },
      });

      if (!existingClient) {
        throw new NotFoundException('Client not found');
      }

      if (dto.tin && dto.tin !== existingClient.tin && !validateTIN(dto.tin)) {
        throw new BadRequestException('Invalid TIN format');
      }

      const updatedClient = await this.prisma.client.update({
        where: {
          id,
          organization_id: organizationId,
        },
        data: dto,
      });

      await this.auditLogService.log({
        organization_id: organizationId,
        entity_type: 'Client',
        entity_id: id,
        action: 'update',
        user_id: userId,
        changes: dto,
      });

      return updatedClient;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Client not found');
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Client with this TIN already exists');
      }
      throw new BadRequestException(error.message || 'Update failed');
    }
  }

  async updateStatus(
    organizationId: string,
    id: string,
    statusDto: UpdateClientStatusDto,
    userId?: string,
  ) {
    const client = await this.prisma.client.findFirst({
      where: {
        id,
        organization_id: organizationId,
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const updatedClient = await this.prisma.client.update({
      where: {
        id,
        organization_id: organizationId,
      },
      data: {
        status: statusDto.status,
      },
    });

    await this.auditLogService.log({
      organization_id: organizationId,
      entity_type: 'Client',
      entity_id: id,
      action: 'update',
      user_id: userId,
      changes: { previousStatus: client.status, newStatus: statusDto.status },
    });

    return updatedClient;
  }

  async softDelete(organizationId: string, id: string, userId?: string) {
    const client = await this.prisma.client.findFirst({
      where: {
        id,
        organization_id: organizationId,
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    await this.auditLogService.log({
      organization_id: organizationId,
      entity_type: 'Client',
      entity_id: id,
      action: 'delete',
      user_id: userId,
      changes: { company_name: client.company_name, tin: client.tin },
    });

    await this.prisma.client.delete({
      where: {
        id,
        organization_id: organizationId,
      },
    });

    return { message: 'Client deleted successfully' };
  }

  async getSubmissionCount(organizationId: string, clientId: string) {
    const client = await this.prisma.client.findFirst({
      where: {
        id: clientId,
        organization_id: organizationId,
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const [totalSubmissions, activeSubmissions] = await Promise.all([
      this.prisma.submission.count({
        where: {
          client_id: clientId,
          organization_id: organizationId,
        },
      }),
      this.prisma.submission.count({
        where: {
          client_id: clientId,
          organization_id: organizationId,
          status: { in: ['draft', 'submitted'] },
        },
      }),
    ]);

    return {
      clientId,
      clientName: client.company_name,
      totalSubmissions,
      activeSubmissions,
    };
  }

  async bulkImport(organizationId: string, csvData: string, userId?: string) {
    const lines = csvData.split('\n').filter((line) => line.trim());

    if (lines.length < 2) {
      throw new BadRequestException('CSV data must contain at least a header and one data row');
    }

    const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const results = {
      imported: 0,
      failed: 0,
      errors: [] as { row: number; message: string }[],
    };

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());

      try {
        const clientData: Partial<CreateClientDto> = {};

        header.forEach((key, index) => {
          const value = values[index];
          if (!value) return;

          switch (key) {
            case 'company_name':
              clientData.company_name = value;
              break;
            case 'tin':
              clientData.tin = value;
              break;
            case 'registration_number':
              clientData.registration_number = value;
              break;
            case 'taxable_period':
              clientData.taxable_period = value as any;
              break;
            case 'industry':
              clientData.industry = value;
              break;
            case 'annual_turnover':
              clientData.annual_turnover = value;
              break;
          }
        });

        if (!clientData.company_name || !clientData.tin) {
          throw new Error('Missing required fields (company_name, tin)');
        }

        await this.create(organizationId, clientData as CreateClientDto, userId);
        results.imported++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          message: error.message || 'Import failed',
        });
      }
    }

    await this.auditLogService.log({
      organization_id: organizationId,
      entity_type: 'Client',
      entity_id: 'bulk_import',
      action: 'create',
      user_id: userId,
      changes: {
        imported: results.imported,
        failed: results.failed,
      },
    });

    return results;
  }

  async export(organizationId: string) {
    const clients = await this.prisma.client.findMany({
      where: { organization_id: organizationId },
      orderBy: { company_name: 'asc' },
    });

    if (clients.length === 0) {
      throw new NotFoundException('No clients found to export');
    }

    const headers =
      'company_name,tin,registration_number,taxable_period,status,industry,annual_turnover,created_at';

    const rows = clients
      .map(
        (client) =>
          `${client.company_name},${client.tin},${client.registration_number || ''},${
            client.taxable_period
          },${client.status},${client.industry || ''},${client.annual_turnover || ''},${client.created_at.toISOString()}`,
      )
      .join('\n');

    return `${headers}\n${rows}`;
  }
}
