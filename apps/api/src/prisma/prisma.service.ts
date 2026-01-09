import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['warn', 'error'],
    });
    
    // Apply Prisma Middleware for automatic tenant filtering
    this.applyTenantMiddleware();
  }

  private applyTenantMiddleware() {
    this.$use(async (params, next) => {
      // Tables that require organization_id filtering
      const tablesWithTenantId = [
        'User',
        'Client',
        'Branding',
        'Upload',
        'MappingTemplate',
        'Submission',
        'Document',
        'AuditLog',
        'Task',
      ];

      // Only apply filtering to tenant-specific tables
      if (tablesWithTenantId.includes(params.model)) {
        // Don't filter if it's a create operation without organization_id
        // (should be passed explicitly in the data)
        if (params.action !== 'create' && params.action !== 'createMany') {
          // For all other operations, ensure organization_id is in where clause
          params.args = params.args || {};
          params.args.where = params.args.where || {};
          
          // Check if we have organization_id in context
          const organizationId = (global as any).organizationId;
          
          if (organizationId && !params.args.where.organization_id) {
            // Auto-add organization_id filter
            params.args.where = {
              ...params.args.where,
              organization_id: organizationId,
            };
          }
        }
      }

      // Special handling for include/select to ensure related data is also filtered
      if (params.action === 'findUnique' || params.action === 'findFirst') {
        const organizationId = (global as any).organizationId;
        
        if (organizationId && params.model === 'Submission') {
          // When fetching a submission, ensure it belongs to the organization
          params.args = params.args || {};
          params.args.where = params.args.where || {};
          
          if (!params.args.where.organization_id) {
            params.args.where.organization_id = organizationId;
          }
        }
      }

      return next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
