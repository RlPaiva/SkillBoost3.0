// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow origins from env var FRONTEND_ORIGINS (comma-separated) or sensible defaults
  // ex: FRONTEND_ORIGINS="http://localhost:5173,http://localhost:5174"
  const originEnv = process.env.FRONTEND_ORIGINS;
  const allowedOrigins = originEnv
    ? originEnv.split(',').map((s) => s.trim())
    : [
        'http://localhost:5173', // Vite dev default
        'http://localhost:5174', // alternative Vite port
        'http://localhost:3000', // possible preview / proxied frontend
      ];

  // Use a function to validate origin so we can allow server-side tools (no-origin) too
  app.enableCors({
    origin: (origin, callback) => {
      // `origin` is undefined for non-browser requests (curl, postman) — allow those
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Otherwise block
      return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Accept',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  // IMPORTANT: bind to 0.0.0.0 so Railway (and other hosts) can reach the server
  await app.listen(port, '0.0.0.0');

  // melhor log — mostra porta e se estiver em produção
  const env = process.env.NODE_ENV || 'development';
  console.log(`NestJS listening on port ${port} (env: ${env})`);
}
bootstrap();
