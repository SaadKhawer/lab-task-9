import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { seedDatabase } from './seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Task 1 — secure application bootstrap.
  app.use(helmet());
  app.enableCors({ origin: 'http://localhost:5173' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await seedDatabase(app);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`Lab 09 API listening on http://localhost:${port}`);
}
bootstrap();
