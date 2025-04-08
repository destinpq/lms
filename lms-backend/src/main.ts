import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Get port from config
  const configService = app.get(ConfigService);
  const envPort = process.env.PORT;
  logger.log(`Environment PORT variable: ${envPort}`);
  const port = configService.get<number>('PORT') || 4441;
  logger.log(`Using port: ${port}`);

  // Run Seeder
  const seedService = app.get(SeedService);
  await seedService.runSeed();

  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`API Documentation available at http://localhost:${port}/api`, 'Bootstrap');
}

void bootstrap();
