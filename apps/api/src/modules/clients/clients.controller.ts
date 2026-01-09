import { Body, Controller, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentTenant } from '../../common/decorators';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto';
import { TenantContextInterceptor } from '../../common/interceptors/tenant-context.interceptor';

@ApiTags('Clients')
@Controller('clients')
@ApiBearerAuth()
@UseInterceptors(TenantContextInterceptor)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a client within current tenant' })
  @ApiResponse({ status: 201, description: 'Client created successfully' })
  async create(
    @CurrentTenant() organizationId: string,
    @Body() dto: CreateClientDto,
  ) {
    return this.clientsService.create(organizationId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List clients for current tenant' })
  @ApiResponse({ status: 200, description: 'Clients retrieved successfully' })
  async findAll(@CurrentTenant() organizationId: string) {
    return this.clientsService.findAll(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID (current tenant only)' })
  @ApiResponse({ status: 200, description: 'Client retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async findById(
    @CurrentTenant() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.clientsService.findById(organizationId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client (current tenant only)' })
  @ApiResponse({ status: 200, description: 'Client updated successfully' })
  async update(
    @CurrentTenant() organizationId: string,
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientsService.update(organizationId, id, dto);
  }
}
