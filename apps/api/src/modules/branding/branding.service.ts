import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { UpdateBrandingDto } from './dto';

@Injectable()
export class BrandingService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getBranding(tenantId: string, accessToken: string) {
    const client = this.supabaseService.createUserClient(accessToken);

    const { data, error } = await client
      .from('branding')
      .select('*')
      .eq('tenant_id', tenantId)
      .maybeSingle();

    if (error) {
      this.supabaseService.handleError(error);
    }

    if (!data) {
      throw new NotFoundException('Branding not found');
    }

    return data;
  }

  async updateBranding(
    tenantId: string,
    accessToken: string,
    dto: UpdateBrandingDto,
  ) {
    const client = this.supabaseService.createUserClient(accessToken);

    const { data, error } = await client
      .from('branding')
      .update({
        ...dto,
        updated_at: new Date().toISOString(),
      })
      .eq('tenant_id', tenantId)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException('Branding not found');
      }
      this.supabaseService.handleError(error);
    }

    return data;
  }

  async uploadLogo(
    tenantId: string,
    accessToken: string,
    file: Express.Multer.File,
  ) {
    return this.uploadAsset(tenantId, accessToken, file, 'logo_url', 'logo');
  }

  async uploadFavicon(
    tenantId: string,
    accessToken: string,
    file: Express.Multer.File,
  ) {
    return this.uploadAsset(
      tenantId,
      accessToken,
      file,
      'favicon_url',
      'favicon',
    );
  }

  private async uploadAsset(
    tenantId: string,
    accessToken: string,
    file: Express.Multer.File,
    column: 'logo_url' | 'favicon_url',
    prefix: 'logo' | 'favicon',
  ) {
    if (!file?.buffer) {
      throw new BadRequestException('No file uploaded');
    }

    const bucket = this.supabaseService.getBucketName();
    const admin = this.supabaseService.getAdminClient();

    const ext = file.originalname.includes('.')
      ? file.originalname.split('.').pop()
      : 'png';

    const path = `branding/${tenantId}/${prefix}.${ext}`;

    const { error: uploadError } = await admin.storage.from(bucket).upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

    if (uploadError) {
      this.supabaseService.handleError(uploadError, 'Upload failed');
    }

    const { data: urlData } = admin.storage.from(bucket).getPublicUrl(path);
    const url = urlData.publicUrl;

    const client = this.supabaseService.createUserClient(accessToken);

    const { data, error } = await client
      .from('branding')
      .update({
        [column]: url,
        updated_at: new Date().toISOString(),
      })
      .eq('tenant_id', tenantId)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException('Branding not found');
      }
      this.supabaseService.handleError(error);
    }

    return data;
  }
}
