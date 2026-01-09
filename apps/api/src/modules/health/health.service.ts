import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check() {
    const start = Date.now();

    let dbStatus = 'healthy';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (e) {
      dbStatus = 'unhealthy';
    }

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
