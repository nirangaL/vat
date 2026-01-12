import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentTenant, CurrentUser, Public, Roles } from '../../common/decorators';
import { RolesGuard } from '../../modules/auth/guards';
import { UserRole } from '@shared/core';
import {
  RegisterTenantDto,
  UpdateTenantDto,
  InviteUserDto,
  UpdateUserRoleDto,
  UpdateSubscriptionDto,
  TenantListQueryDto,
} from './dto';
import { TenantsService } from './tenants.service';
import { TenantContextInterceptor } from '../../common/interceptors/tenant-context.interceptor';

@ApiTags('Tenants')
@Controller('tenants')
@UseGuards(RolesGuard)
@UseInterceptors(TenantContextInterceptor)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new tenant (service provider)' })
  @ApiResponse({ status: 201, description: 'Tenant registered successfully' })
  async register(@Body() dto: RegisterTenantDto) {
    return this.tenantsService.register(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current tenant's profile" })
  @ApiResponse({ status: 200, description: 'Tenant profile retrieved' })
  async me(@CurrentTenant() organizationId: string) {
    return this.tenantsService.findMe(organizationId);
  }

  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update current tenant's profile" })
  @ApiResponse({ status: 200, description: 'Tenant profile updated' })
  async updateMe(
    @CurrentTenant() organizationId: string,
    @Body() dto: UpdateTenantDto,
    @CurrentUser() user: any,
  ) {
    return this.tenantsService.updateMe(organizationId, dto);
  }

  @Get('me/subscription')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current tenant's subscription details" })
  @ApiResponse({ status: 200, description: 'Subscription details retrieved' })
  async getSubscription(@CurrentTenant() organizationId: string) {
    return this.tenantsService.getSubscription(organizationId);
  }

  @Patch('me/subscription')
  @ApiBearerAuth()
  @Roles(UserRole.VAT_TEAM_LEAD)
  @ApiOperation({ summary: "Update current tenant's subscription (admin only)" })
  @ApiResponse({ status: 200, description: 'Subscription updated' })
  async updateSubscription(
    @CurrentTenant() organizationId: string,
    @Body() dto: UpdateSubscriptionDto,
    @CurrentUser() user: any,
  ) {
    return this.tenantsService.updateSubscription(organizationId, dto, user.id);
  }

  @Get('me/metrics')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current tenant's metrics and analytics" })
  @ApiResponse({ status: 200, description: 'Metrics retrieved successfully' })
  async getMetrics(@CurrentTenant() organizationId: string) {
    return this.tenantsService.getMetrics(organizationId);
  }

  @Get('me/users')
  @ApiBearerAuth()
  @ApiOperation({ summary: "List all users in current tenant's organization" })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getUsers(@CurrentTenant() organizationId: string) {
    return this.tenantsService.getUsers(organizationId);
  }

  @Post('me/users')
  @ApiBearerAuth()
  @Roles(UserRole.VAT_TEAM_LEAD)
  @ApiOperation({ summary: 'Add/invite user to organization (admin only)' })
  @ApiResponse({ status: 201, description: 'User added successfully' })
  async addUser(
    @CurrentTenant() organizationId: string,
    @Body() dto: InviteUserDto,
    @CurrentUser() user: any,
  ) {
    return this.tenantsService.addUser(organizationId, dto, user.id);
  }

  @Delete('me/users/:userId')
  @ApiBearerAuth()
  @Roles(UserRole.VAT_TEAM_LEAD)
  @ApiOperation({ summary: 'Remove user from organization (admin only)' })
  @ApiResponse({ status: 200, description: 'User removed successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async removeUser(
    @CurrentTenant() organizationId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ) {
    return this.tenantsService.removeUser(organizationId, userId, user.id);
  }

  @Patch('me/users/:userId/role')
  @ApiBearerAuth()
  @Roles(UserRole.VAT_TEAM_LEAD)
  @ApiOperation({ summary: "Update user's role (admin only)" })
  @ApiResponse({ status: 200, description: 'User role updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUserRole(
    @CurrentTenant() organizationId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateUserRoleDto,
    @CurrentUser() user: any,
  ) {
    return this.tenantsService.updateUserRole(organizationId, userId, dto, user.id);
  }

  @Get()
  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List all tenants (super admin only)' })
  @ApiResponse({ status: 200, description: 'Tenants retrieved successfully' })
  async findAll(@Query() query: TenantListQueryDto) {
    return this.tenantsService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get tenant by ID (super admin only)' })
  @ApiResponse({ status: 200, description: 'Tenant retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async findById(@Param('id') id: string, @CurrentUser() user?: any) {
    return this.tenantsService.findById(id, user?.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete tenant (super admin only)' })
  @ApiResponse({ status: 200, description: 'Tenant deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async softDelete(@Param('id') id: string) {
    return this.tenantsService.softDelete(id);
  }
}
