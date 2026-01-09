import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateUploadDto } from './dto';

@Injectable()
export class UploadsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async upload(
    tenantId: string,
    accessToken: string,
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
    const path = `uploads/${tenantId}/${clientPath}/${timestamp}-${safeName}`;

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

    const client = this.supabaseService.createUserClient(accessToken);

    const { data, error } = await client
      .from('uploads')
      .insert({
        tenant_id: tenantId,
        client_id: dto.client_id,
        file_name: file.originalname,
        file_url: fileUrl,
        file_size: file.size,
        file_type: file.mimetype,
        upload_type: dto.upload_type ?? 'csv',
        status: 'uploaded',
      })
      .select('*')
      .single();

    if (error) {
      this.supabaseService.handleError(error);
    }

    return data;
  }

  async list(tenantId: string, accessToken: string) {
    const client = this.supabaseService.createUserClient(accessToken);

    const { data, error } = await client
      .from('uploads')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) {
      this.supabaseService.handleError(error);
    }

    return data ?? [];
  }

  async getById(tenantId: string, accessToken: string, id: string) {
    const client = this.supabaseService.createUserClient(accessToken);

    const { data, error } = await client
      .from('uploads')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException('Upload not found');
      }
      this.supabaseService.handleError(error);
    }

    return data;
  }
}
