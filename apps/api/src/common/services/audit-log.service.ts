import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface AuditLogOptions {
  organization_id: string;
  entity_type: string;
  entity_id: string;
  action: 'create' | 'update' | 'delete';
  user_id?: string;
  changes?: Record<string, any>;
  ip_address?: string;
  submission_id?: string;
}

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async log(options: AuditLogOptions) {
    return this.prisma.auditLog.create({
      data: {
        organization_id: options.organization_id,
        entity_type: options.entity_type,
        entity_id: options.entity_id,
        action: options.action,
        user_id: options.user_id,
        changes: options.changes,
        ip_address: options.ip_address,
        submission_id: options.submission_id,
      },
    });
  }

  async getEntityHistory(organizationId: string, entityType: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: {
        organization_id: organizationId,
        entity_type: entityType,
        entity_id: entityId,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }
}
