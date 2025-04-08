import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LanguagesModule } from '../languages/languages.module';
import { TopicsModule } from '../topics/topics.module';
import { QuestionsModule } from '../questions/questions.module';
import { CoursesModule } from '../courses/courses.module';
import { UsersModule } from '../users/users.module';
import { IntegrationModule } from '../integration/integration.module';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([]),
    LanguagesModule,
    TopicsModule,
    QuestionsModule,
    CoursesModule,
    UsersModule,
    IntegrationModule,
  ],
  providers: [SeedService, Logger],
  exports: [SeedService],
})
export class SeedModule {} 