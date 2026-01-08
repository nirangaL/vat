import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.setGlobalPrefix('api');

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
    .setTitle('VAT Management System API')
    .setDescription(
      'Comprehensive API for VAT Management and IRD Submission System for Sri Lankan Companies',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Companies', 'Company registration and management')
    .addTag('Uploads', 'File upload and management (CSV/Excel)')
    .addTag('Mapping', 'Column mapping templates and detection')
    .addTag('Notifications', 'Email and in-app notifications')
    .addTag('Health', 'Health check and system status')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
  }

  fs.writeFileSync(
    './swagger-spec.json',
    JSON.stringify(document, null, 2),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║   🚀 VAT Management System API                           ║
    ║                                                           ║
    ║   🌐 Server running on: http://localhost:${port}           ║
    ║   📚 API Documentation: http://localhost:${port}/api/docs  ║
    ║   📄 OpenAPI Spec: http://localhost:${port}/api/docs-json  ║
    ║   ❤️  Health Check: http://localhost:${port}/api/health    ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
  `);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
