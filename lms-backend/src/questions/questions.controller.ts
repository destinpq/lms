import { Controller, Get, Post, Body, Param, Query, Delete, Put, NotFoundException } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Question, DifficultyLevel } from './entities/question.entity';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  async findAll(
    @Query('topicId') topicId?: string,
    @Query('difficulty') difficulty?: DifficultyLevel,
  ): Promise<Question[]> {
    if (topicId && difficulty) {
      return this.questionsService.findByTopicAndDifficulty(topicId, difficulty);
    }
    
    if (topicId) {
      return this.questionsService.findByTopic(topicId);
    }
    
    if (difficulty) {
      return this.questionsService.findByDifficulty(difficulty);
    }
    
    return this.questionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Question | null> {
    return this.questionsService.findOne(id);
  }

  @Post()
  async create(@Body() questionData: Partial<Question>): Promise<Question> {
    return this.questionsService.create(questionData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() questionData: Partial<Question>): Promise<Question | null> {
    return this.questionsService.update(id, questionData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.questionsService.remove(id);
  }

  @Get('topic/:topicId/get-or-generate')
  async getOrGenerateQuestion(
    @Param('topicId') topicId: string,
    @Query('difficulty') difficulty: DifficultyLevel = DifficultyLevel.MEDIUM,
  ): Promise<Question | Partial<Question>> {
    const question = await this.questionsService.getOrCreateQuestion(topicId, difficulty);
    
    if (!question) {
      throw new NotFoundException(`Could not find or generate question for topic ${topicId} with difficulty ${difficulty}`);
    }
    
    return question;
  }

  @Get('user/:userId/topic/:topicId')
  async getQuestionForUser(
    @Param('userId') userId: string,
    @Param('topicId') topicId: string,
  ): Promise<Question | Partial<Question>> {
    const question = await this.questionsService.getQuestionForUser(userId, topicId);
    
    if (!question) {
      throw new NotFoundException(`Could not find or generate question for user ${userId}, topic ${topicId}`);
    }
    
    return question;
  }

  @Get('generate')
  async generateQuestionOnDemand(
    @Query('topicId') topicId: string,
    @Query('difficulty') difficulty: DifficultyLevel = DifficultyLevel.MEDIUM,
  ): Promise<Partial<Question>> {
    if (!topicId) {
      throw new NotFoundException('topicId is required');
    }
    
    const question = await this.questionsService.generateQuestionOnDemand(topicId, difficulty);
    
    if (!question) {
      throw new NotFoundException(`Could not generate question for topic ${topicId} with difficulty ${difficulty}`);
    }
    
    return question;
  }
} 