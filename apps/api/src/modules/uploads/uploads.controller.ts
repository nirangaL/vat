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
import { CurrentTenant, CurrentUser } from '../../common/decorators';
import { CreateUploadDto } from './dto';
import { UploadsService } from './uploads.service';

@ApiTags('Uploads')
@Controller('uploads')
@ApiBearerAuth()
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
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateUploadDto,
  ) {
    return this.uploadsService.upload(tenantId, user.accessToken, file, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List uploads for current tenant' })
  async list(@CurrentTenant() tenantId: string, @CurrentUser() user: any) {
    return this.uploadsService.list(tenantId, user.accessToken);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get upload by id (current tenant only)' })
  async getById(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    return this.uploadsService.getById(tenantId, user.accessToken, id);
  }
}
