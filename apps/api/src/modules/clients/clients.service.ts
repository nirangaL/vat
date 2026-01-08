import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { validateTIN } from '@shared/validators';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateClientDto, UpdateClientDto } from './dto';

@Injectable()
export class ClientsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(tenantId: string, accessToken: string, dto: CreateClientDto) {
    if (!validateTIN(dto.tin)) {
      throw new BadRequestException('Invalid TIN format');
    }

    const client = this.supabaseService.createUserClient(accessToken);

    const { data, error } = await client
      .from('clients')
      .insert({
        ...dto,
        tenant_id: tenantId,
      })
      .select('*')
      .single();

    if (error) {
      const msg = error.message ?? 'Client creation failed';
      if (msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('unique')) {
        throw new ConflictException(msg);
      }
      throw new BadRequestException(msg);
    }

    return data;
  }

  async findAll(tenantId: string, accessToken: string) {
    const client = this.supabaseService.createUserClient(accessToken);

    const { data, error } = await client
      .from('clients')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });

    if (error) {
      this.supabaseService.handleError(error);
    }

    return data ?? [];
  }

  async findById(tenantId: string, accessToken: string, id: string) {
    const client = this.supabaseService.createUserClient(accessToken);

    const { data, error } = await client
      .from('clients')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException('Client not found');
      }
      this.supabaseService.handleError(error);
    }

    if (!data) {
      throw new NotFoundException('Client not found');
    }

    return data;
  }

  async update(tenantId: string, accessToken: string, id: string, dto: UpdateClientDto) {
    const client = this.supabaseService.createUserClient(accessToken);

    const { data, error } = await client
      .from('clients')
      .update({
        ...dto,
        updated_at: new Date().toISOString(),
      })
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException('Client not found');
      }
      this.supabaseService.handleError(error);
    }

    return data;
  }
}
