import { Module } from '@nestjs/common';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { AuditLogService } from '../../common/services';

@Module({
  controllers: [TenantsController],
  providers: [TenantsService, AuditLogService],
  exports: [TenantsService],
})
export class TenantsModule {}
