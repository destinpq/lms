import { Controller, Get, Query } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { Topic } from './entities/topic.entity';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  findAll(@Query('languageId') languageId?: string): Promise<Topic[]> {
    return this.topicsService.findAll(languageId);
  }
} 