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
import { CurrentTenant, CurrentUser } from '../../common/decorators';
import { BrandingService } from './branding.service';
import { UpdateBrandingDto } from './dto';

@ApiTags('Branding')
@Controller('branding')
@ApiBearerAuth()
export class BrandingController {
  constructor(private readonly brandingService: BrandingService) {}

  @Get()
  @ApiOperation({ summary: 'Get branding for current tenant' })
  @ApiResponse({ status: 200, description: 'Branding retrieved successfully' })
  async getBranding(@CurrentTenant() tenantId: string, @CurrentUser() user: any) {
    return this.brandingService.getBranding(tenantId, user.accessToken);
  }

  @Patch()
  @ApiOperation({ summary: 'Update branding for current tenant' })
  @ApiResponse({ status: 200, description: 'Branding updated successfully' })
  async updateBranding(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateBrandingDto,
  ) {
    return this.brandingService.updateBranding(tenantId, user.accessToken, dto);
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
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.brandingService.uploadLogo(tenantId, user.accessToken, file);
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
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.brandingService.uploadFavicon(tenantId, user.accessToken, file);
  }
}
