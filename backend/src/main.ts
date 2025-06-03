import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL', 'http://localhost:5173'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  const config = new DocumentBuilder()
    .setTitle(
      configService.get<string>(
        'SWAGGER_TITLE',
        'RPG Character Management API',
      ),
    )
    .setDescription(
      configService.get<string>(
        'SWAGGER_DESCRIPTION',
        'API for managing characters in a role-playing game system. This backend service provides endpoints for character creation, management, and battle mechanics.',
      ),
    )
    .setVersion(configService.get<string>('SWAGGER_VERSION', '1.0'))
    .addTag('characters', 'Character management endpoints')
    .addTag('battles', 'Battle system endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    configService.get<string>('SWAGGER_PATH', 'api-docs'),
    app,
    document,
  );

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
