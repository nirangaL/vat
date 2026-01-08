import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { UploadFileDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';
import { CurrentUser } from '../../common/decorators';

@ApiTags('Uploads')
@Controller('uploads')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload CSV/Excel file' })
  @ApiBody({
    description: 'File upload with metadata',
    type: UploadFileDto,
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { companyId: string; mappingTemplateId?: string },
    @CurrentUser() user: any,
  ) {
    return this.uploadsService.uploadFile(
      file,
      body.companyId,
      user.userId,
      body.mappingTemplateId,
    );
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Get all uploads for a company' })
  @ApiResponse({ status: 200, description: 'Uploads retrieved successfully' })
  async findByCompany(@Param('companyId') companyId: string, @Query() query: any) {
    return this.uploadsService.findByCompany(companyId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get upload by ID' })
  @ApiResponse({ status: 200, description: 'Upload retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Upload not found' })
  async findById(@Param('id') id: string) {
    return this.uploadsService.findById(id);
  }

  @Get(':id/url')
  @ApiOperation({ summary: 'Get signed URL for file download' })
  @ApiResponse({ status: 200, description: 'Signed URL generated successfully' })
  @ApiResponse({ status: 404, description: 'Upload not found' })
  async getFileUrl(@Param('id') id: string, @Query('expiresIn') expiresIn?: number) {
    return this.uploadsService.getFileUrl(id, expiresIn ? parseInt(expiresIn as any) : 3600);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete uploaded file' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 404, description: 'Upload not found' })
  async deleteFile(@Param('id') id: string) {
    return this.uploadsService.deleteFile(id);
  }
}
