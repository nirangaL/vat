import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class HealthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async check() {
    const start = Date.now();

    const admin = this.supabaseService.getAdminClient();
    const { error } = await admin.from('vat_rules').select('id').limit(1);

    const dbStatus = error ? 'unhealthy' : 'healthy';

    return {
      status: dbStatus === 'healthy' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      service: 'VAT Management API',
      version: '1.0.0',
      uptime: process.uptime(),
      checks: {
        database: {
          status: dbStatus,
          responseTime: `${Date.now() - start}ms`,
        },
        memory: {
          status: 'healthy',
          usage: process.memoryUsage(),
        },
      },
    };
  }
}
