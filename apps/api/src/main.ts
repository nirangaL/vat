import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const prefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(prefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  });

  const config = new DocumentBuilder()
    .setTitle('VAT Management SaaS API')
    .setDescription(
      'Multi-tenant VAT Management and IRD Submission API (Supabase PostgreSQL + RLS + White-labeling)',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'Supabase Auth + JWT tenant context')
    .addTag('Tenants', 'Service provider (tenant) registration and profile')
    .addTag('Branding', 'White-label branding per tenant')
    .addTag('Clients', 'Tenant client management')
    .addTag('Health', 'Health check and system status')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${prefix}/docs`, app, document);

  if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
  }

  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║   🚀 VAT Management System API                           ║
    ║                                                           ║
    ║   🌐 Server running on: http://localhost:${port}           ║
    ║   📚 API Documentation: http://localhost:${port}/${prefix}/docs  ║
    ║   📄 OpenAPI Spec: http://localhost:${port}/${prefix}/docs-json  ║
    ║   ❤️  Health Check: http://localhost:${port}/${prefix}/health    ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
  `);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
