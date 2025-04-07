import { Controller, Get, Post, Body, Param, Query, Delete, Put } from '@nestjs/common';
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

  @Get('topic/:topicId/random')
  async getRandomQuestion(
    @Param('topicId') topicId: string,
    @Query('difficulty') difficulty: DifficultyLevel = DifficultyLevel.MEDIUM,
  ): Promise<Question> {
    const question = await this.questionsService.getRandomQuestion(topicId, difficulty);
    
    if (!question) {
      throw new Error(`No questions found for topic ${topicId} with difficulty ${difficulty}`);
    }
    
    return question;
  }
} 