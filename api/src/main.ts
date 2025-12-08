// top of src/main.ts (first lines)
import { webcrypto as nodeWebCrypto } from 'crypto';

if (typeof globalThis.crypto === 'undefined') {
  (globalThis as any).crypto = nodeWebCrypto;
}

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // await app.listen(3001,'0.0.0.0');
  app.enableCors({
    origin: ['http://radinate-frontend-bucket.s3-website-us-east-1.amazonaws.com/','http://localhost:3000'],
    credentials: true
  });
  await app.getHttpServer().listen(3001);
  console.log('API listening on http://localhost:3001');
}
bootstrap();
