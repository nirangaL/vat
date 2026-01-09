import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentTenant } from '../../common/decorators';
import { BrandingService } from './branding.service';
import { UpdateBrandingDto } from './dto';
import { TenantContextInterceptor } from '../../common/interceptors/tenant-context.interceptor';

@ApiTags('Branding')
@Controller('branding')
@ApiBearerAuth()
@UseInterceptors(TenantContextInterceptor)
export class BrandingController {
  constructor(private readonly brandingService: BrandingService) {}

  @Get()
  @ApiOperation({ summary: 'Get branding for current tenant' })
  @ApiResponse({ status: 200, description: 'Branding retrieved successfully' })
  async getBranding(@CurrentTenant() organizationId: string) {
    return this.brandingService.getBranding(organizationId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update branding for current tenant' })
  @ApiResponse({ status: 200, description: 'Branding updated successfully' })
  async updateBranding(
    @CurrentTenant() organizationId: string,
    @Body() dto: UpdateBrandingDto,
  ) {
    return this.brandingService.updateBranding(organizationId, dto);
  }

  @Post('logo')
  @ApiOperation({ summary: 'Upload tenant logo to Supabase Storage' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(
    @CurrentTenant() organizationId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.brandingService.uploadLogo(organizationId, file);
  }

  @Post('favicon')
  @ApiOperation({ summary: 'Upload tenant favicon to Supabase Storage' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFavicon(
    @CurrentTenant() organizationId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.brandingService.uploadFavicon(organizationId, file);
  }
}
