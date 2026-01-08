import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentTenant, CurrentUser } from '../../common/decorators';
import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto } from './dto';

@ApiTags('Clients')
@Controller('clients')
@ApiBearerAuth()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a client within current tenant' })
  @ApiResponse({ status: 201, description: 'Client created successfully' })
  async create(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateClientDto,
  ) {
    return this.clientsService.create(tenantId, user.accessToken, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List clients for current tenant' })
  @ApiResponse({ status: 200, description: 'Clients retrieved successfully' })
  async findAll(@CurrentTenant() tenantId: string, @CurrentUser() user: any) {
    return this.clientsService.findAll(tenantId, user.accessToken);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID (current tenant only)' })
  @ApiResponse({ status: 200, description: 'Client retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async findById(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    return this.clientsService.findById(tenantId, user.accessToken, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client (current tenant only)' })
  @ApiResponse({ status: 200, description: 'Client updated successfully' })
  async update(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientsService.update(tenantId, user.accessToken, id, dto);
  }
}
