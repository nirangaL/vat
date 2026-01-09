import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUploadDto } from './dto';

@Injectable()
export class UploadsService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly prisma: PrismaService,
  ) {}

  async upload(
    organizationId: string,
    file: Express.Multer.File,
    dto: CreateUploadDto,
  ) {
    if (!file?.buffer) {
      throw new BadRequestException('No file uploaded');
    }

    const bucket = this.supabaseService.getBucketName();
    const admin = this.supabaseService.getAdminClient();

    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    const clientPath = dto.client_id ? `client-${dto.client_id}` : 'general';
    const path = `uploads/${organizationId}/${clientPath}/${timestamp}-${safeName}`;

    const { error: uploadError } = await admin.storage
      .from(bucket)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      this.supabaseService.handleError(uploadError, 'Upload failed');
    }

    const { data: urlData } = admin.storage.from(bucket).getPublicUrl(path);
    const fileUrl = urlData.publicUrl;

    try {
      return await this.prisma.upload.create({
        data: {
          organization_id: organizationId,
          client_id: dto.client_id,
          file_name: file.originalname,
          file_url: fileUrl,
          file_size: file.size,
          file_type: file.mimetype,
          upload_type: dto.upload_type ?? 'csv',
          status: 'uploaded',
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message || 'Database creation failed');
    }
  }

  async list(organizationId: string) {
    return this.prisma.upload.findMany({
      where: {
        organization_id: organizationId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getById(organizationId: string, id: string) {
    const upload = await this.prisma.upload.findUnique({
      where: {
        id,
        organization_id: organizationId,
      },
    });

    if (!upload) {
      throw new NotFoundException('Upload not found');
    }

    return upload;
  }
}
