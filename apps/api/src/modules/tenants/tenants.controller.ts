import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentTenant, CurrentUser, Public } from '../../common/decorators';
import { RegisterTenantDto, UpdateTenantDto } from './dto';
import { TenantsService } from './tenants.service';

@ApiTags('Tenants')
@Controller('tenants')
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
  async me(@CurrentTenant() tenantId: string, @CurrentUser() user: any) {
    return this.tenantsService.findMe(tenantId, user.accessToken);
  }

  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update current tenant's profile" })
  @ApiResponse({ status: 200, description: 'Tenant profile updated' })
  async updateMe(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateTenantDto,
  ) {
    return this.tenantsService.updateMe(tenantId, user.accessToken, dto);
  }
}
