import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type SupabaseAuthUser = {
  id: string;
  email?: string;
  app_metadata?: Record<string, any>;
  user_metadata?: Record<string, any>;
};

@Injectable()
export class SupabaseService {
  private readonly url: string;
  private readonly anonKey: string;
  private readonly serviceRoleKey: string;
  private readonly bucketName: string;

  private readonly adminClient: SupabaseClient;
  private readonly anonClient: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    this.url = this.configService.get<string>('supabase.url') || '';
    this.anonKey = this.configService.get<string>('supabase.anonKey') || '';
    this.serviceRoleKey =
      this.configService.get<string>('supabase.serviceRoleKey') || '';
    this.bucketName = this.configService.get<string>('supabase.bucketName') || '';

    if (!this.url || !this.anonKey || !this.serviceRoleKey) {
      throw new InternalServerErrorException(
        'Supabase config missing (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)',
      );
    }

    this.adminClient = createClient(this.url, this.serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    this.anonClient = createClient(this.url, this.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  getAdminClient(): SupabaseClient {
    return this.adminClient;
  }

  getAnonClient(): SupabaseClient {
    return this.anonClient;
  }

  getBucketName(): string {
    return this.bucketName;
  }

  createUserClient(accessToken: string): SupabaseClient {
    return createClient(this.url, this.anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  async getAuthUser(accessToken: string): Promise<SupabaseAuthUser> {
    const { data, error } = await this.anonClient.auth.getUser(accessToken);

    if (error || !data?.user) {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    return {
      id: data.user.id,
      email: data.user.email ?? undefined,
      app_metadata: data.user.app_metadata ?? undefined,
      user_metadata: data.user.user_metadata ?? undefined,
    };
  }

  handleError(error: any, fallbackMessage = 'Supabase operation failed'): never {
    if (typeof error?.message === 'string') {
      throw new InternalServerErrorException(error.message);
    }
    throw new InternalServerErrorException(fallbackMessage);
  }
}
