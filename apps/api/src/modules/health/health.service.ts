import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private connection: Connection) {}

  async check() {
    const dbStatus = this.connection.readyState === 1 ? 'healthy' : 'unhealthy';

    return {
      status: dbStatus === 'healthy' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      service: 'VAT Management API',
      version: '1.0.0',
      uptime: process.uptime(),
      checks: {
        database: {
          status: dbStatus,
          responseTime: dbStatus === 'healthy' ? 'connected' : 'disconnected',
        },
        memory: {
          status: 'healthy',
          usage: process.memoryUsage(),
        },
      },
    };
  }
}
