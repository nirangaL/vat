import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateBrandingDto } from './dto';

@Injectable()
export class BrandingService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly prisma: PrismaService,
  ) {}

  async getBranding(organizationId: string) {
    const branding = await this.prisma.branding.findUnique({
      where: { organization_id: organizationId },
    });

    if (!branding) {
      throw new NotFoundException('Branding not found');
    }

    return branding;
  }

  async updateBranding(organizationId: string, dto: UpdateBrandingDto) {
    try {
      return await this.prisma.branding.update({
        where: { organization_id: organizationId },
        data: dto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Branding not found');
      }
      throw new BadRequestException(error.message || 'Update failed');
    }
  }

  async uploadLogo(organizationId: string, file: Express.Multer.File) {
    return this.uploadAsset(organizationId, file, 'logo_url', 'logo');
  }

  async uploadFavicon(organizationId: string, file: Express.Multer.File) {
    return this.uploadAsset(organizationId, file, 'favicon_url', 'favicon');
  }

  private async uploadAsset(
    organizationId: string,
    file: Express.Multer.File,
    column: 'logo_url' | 'favicon_url',
    prefix: 'logo' | 'favicon',
  ) {
    if (!file?.buffer) {
      throw new BadRequestException('No file uploaded');
    }

    const bucket = this.supabaseService.getBucketName();
    const admin = this.supabaseService.getAdminClient();

    const ext = file.originalname.includes('.') ? file.originalname.split('.').pop() : 'png';

    const path = `branding/${organizationId}/${prefix}.${ext}`;

    const { error: uploadError } = await admin.storage.from(bucket).upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

    if (uploadError) {
      this.supabaseService.handleError(uploadError, 'Upload failed');
    }

    const { data: urlData } = admin.storage.from(bucket).getPublicUrl(path);
    const url = urlData.publicUrl;

    try {
      return await this.prisma.branding.update({
        where: { organization_id: organizationId },
        data: {
          [column]: url,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Branding not found');
      }
      throw new BadRequestException(error.message || 'Update failed');
    }
  }
}
