import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentTenant, CurrentUser, Roles } from '../../common/decorators';
import { RolesGuard } from '../../modules/auth/guards';
import { UserRole } from '@shared/core';
import { ClientsService } from './clients.service';
import {
  CreateClientDto,
  UpdateClientDto,
  UpdateClientStatusDto,
  ClientListQueryDto,
  BulkImportClientsDto,
} from './dto';
import { TenantContextInterceptor } from '../../common/interceptors/tenant-context.interceptor';

@ApiTags('Clients')
@Controller('clients')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseInterceptors(TenantContextInterceptor)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a client within current tenant' })
  @ApiResponse({ status: 201, description: 'Client created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid TIN format' })
  @ApiResponse({ status: 409, description: 'Client with this TIN already exists' })
  async create(
    @CurrentTenant() organizationId: string,
    @Body() dto: CreateClientDto,
    @CurrentUser() user: any,
  ) {
    return this.clientsService.create(organizationId, dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List clients for current tenant with pagination' })
  @ApiResponse({ status: 200, description: 'Clients retrieved successfully' })
  async findAll(@CurrentTenant() organizationId: string, @Query() query: ClientListQueryDto) {
    return this.clientsService.findAll(organizationId, query);
  }

  @Get('export/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="clients.csv"')
  @ApiOperation({ summary: 'Export clients as CSV' })
  @ApiResponse({ status: 200, description: 'CSV file generated' })
  @ApiResponse({ status: 404, description: 'No clients found' })
  async export(@CurrentTenant() organizationId: string) {
    return this.clientsService.export(organizationId);
  }

  @Post('bulk-import')
  @ApiOperation({ summary: 'Bulk import clients from CSV data' })
  @ApiResponse({ status: 201, description: 'Clients imported successfully' })
  @ApiResponse({ status: 400, description: 'Invalid CSV data' })
  async bulkImport(
    @CurrentTenant() organizationId: string,
    @Body() dto: BulkImportClientsDto,
    @CurrentUser() user: any,
  ) {
    return this.clientsService.bulkImport(organizationId, dto.csvData, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID (current tenant only)' })
  @ApiResponse({ status: 200, description: 'Client retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async findById(@CurrentTenant() organizationId: string, @Param('id') id: string) {
    return this.clientsService.findById(organizationId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client (current tenant only)' })
  @ApiResponse({ status: 200, description: 'Client updated successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 409, description: 'Client with this TIN already exists' })
  async update(
    @CurrentTenant() organizationId: string,
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
    @CurrentUser() user: any,
  ) {
    return this.clientsService.update(organizationId, id, dto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client (archive)' })
  @ApiResponse({ status: 200, description: 'Client deleted successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async softDelete(
    @CurrentTenant() organizationId: string,
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.clientsService.softDelete(organizationId, id, user.id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update client status (active/inactive/suspended)' })
  @ApiResponse({ status: 200, description: 'Client status updated successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async updateStatus(
    @CurrentTenant() organizationId: string,
    @Param('id') id: string,
    @Body() dto: UpdateClientStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.clientsService.updateStatus(organizationId, id, dto, user.id);
  }

  @Get(':id/submissions-count')
  @ApiOperation({ summary: 'Get submission count for a specific client' })
  @ApiResponse({ status: 200, description: 'Submission count retrieved' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async getSubmissionCount(@CurrentTenant() organizationId: string, @Param('id') id: string) {
    return this.clientsService.getSubmissionCount(organizationId, id);
  }
}
