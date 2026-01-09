import { Body, Controller, Get, Patch, Post, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentTenant, Public } from '../../common/decorators';
import { RegisterTenantDto, UpdateTenantDto } from './dto';
import { TenantsService } from './tenants.service';
import { TenantContextInterceptor } from '../../common/interceptors/tenant-context.interceptor';

@ApiTags('Tenants')
@Controller('tenants')
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
  ) {
    return this.tenantsService.updateMe(organizationId, dto);
  }
}
