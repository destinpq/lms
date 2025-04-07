import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { ProgressModule } from './progress/progress.module';
import { CommunicationModule } from './communication/communication.module';
import { FilesModule } from './files/files.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { GamificationModule } from './gamification/gamification.module';
import { IntegrationModule } from './integration/integration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: parseInt(configService.get('DB_PORT', '5432')),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'lms'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('DB_SSL') === 'true' 
          ? {
              rejectUnauthorized: false,
            } 
          : false,
      }),
    }),
    UsersModule,
    AuthModule,
    CoursesModule,
    AssessmentsModule,
    ProgressModule,
    CommunicationModule,
    FilesModule,
    AnalyticsModule,
    GamificationModule,
    IntegrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
