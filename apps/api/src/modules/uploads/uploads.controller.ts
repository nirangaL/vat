import {
  Body,
  Controller,
  Get,
  Param,
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
import { memoryStorage } from 'multer';
import { CurrentTenant } from '../../common/decorators';
import { CreateUploadDto } from './dto';
import { UploadsService } from './uploads.service';
import { TenantContextInterceptor } from '../../common/interceptors/tenant-context.interceptor';

@ApiTags('Uploads')
@Controller('uploads')
@ApiBearerAuth()
@UseInterceptors(TenantContextInterceptor)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a VAT file (stored in Supabase Storage)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        client_id: { type: 'string', format: 'uuid' },
        upload_type: { type: 'string' },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  async upload(
    @CurrentTenant() organizationId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateUploadDto,
  ) {
    return this.uploadsService.upload(organizationId, file, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List uploads for current tenant' })
  async list(@CurrentTenant() organizationId: string) {
    return this.uploadsService.list(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get upload by id (current tenant only)' })
  async getById(
    @CurrentTenant() organizationId: string,
    @Param('id') id: string,
  ) {
    return this.uploadsService.getById(organizationId, id);
  }
}
