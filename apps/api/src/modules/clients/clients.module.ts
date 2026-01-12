import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { AuditLogService } from '../../common/services';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService, AuditLogService],
})
export class ClientsModule {}
