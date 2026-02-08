import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let app: any;
let isInitialized = false;

async function bootstrap() {
  if (isInitialized) return;
  
  try {
    app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.enableCors({
      origin: process.env.FRONTEND_URL || '*',
      credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));

    const config = new DocumentBuilder()
      .setTitle('Spend Tracker API')
      .setDescription('API for managing personal finances')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
    isInitialized = true;
    console.log('NestJS app initialized successfully');

    // For local development only
    if (!process.env.VERCEL) {
      const port = process.env.PORT || 3000;
      await app.listen(port);
      console.log(`Application is running on: http://localhost:${port}`);
      console.log(`API Documentation: http://localhost:${port}/api`);
    }
  } catch (error) {
    console.error('Failed to initialize app:', error);
    throw error;
  }
}

// Initialize immediately
bootstrap();

// Vercel serverless handler
export default async function handler(req: any, res: any) {
  if (!isInitialized) {
    await bootstrap();
  }
  return server(req, res);
}
