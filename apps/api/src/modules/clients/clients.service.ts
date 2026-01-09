import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { validateTIN } from '@shared/core';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClientDto, UpdateClientDto } from './dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: string, dto: CreateClientDto) {
    if (!validateTIN(dto.tin)) {
      throw new BadRequestException('Invalid TIN format');
    }

    try {
      return await this.prisma.client.create({
        data: {
          ...dto,
          organization_id: organizationId,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Client with this TIN already exists');
      }
      throw new BadRequestException(error.message || 'Client creation failed');
    }
  }

  async findAll(organizationId: string) {
    return this.prisma.client.findMany({
      where: {
        organization_id: organizationId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
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

  async update(organizationId: string, id: string, dto: UpdateClientDto) {
    try {
      return await this.prisma.client.update({
        where: {
          id,
          organization_id: organizationId,
        },
        data: dto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Client not found');
      }
      throw new BadRequestException(error.message || 'Update failed');
    }
  }
}
