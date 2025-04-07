import { Controller, Get, Post, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { Submission } from './entities/submission.entity';
// Note: You may need to adjust these imports based on your actual auth setup
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { Request } from 'express';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get()
  async findAll(@Query('userId') userId?: string, @Query('questionId') questionId?: string): Promise<Submission[]> {
    if (userId && questionId) {
      return this.submissionsService.findUserSubmissionsForQuestion(userId, questionId);
    }
    
    if (userId) {
      return this.submissionsService.findByUser(userId);
    }
    
    if (questionId) {
      return this.submissionsService.findByQuestion(questionId);
    }
    
    return this.submissionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Submission | null> {
    return this.submissionsService.findOne(id);
  }

  @Post()
  // @UseGuards(JwtAuthGuard) // Uncomment once auth is set up
  async create(
    @Body() submissionData: { userId: string; questionId: string; code: string; languageSlug: string },
    // @Req() request: Request, // Uncomment once auth is set up
  ): Promise<Submission> {
    // Uncomment this and remove userId from submissionData once auth is set up
    // const userId = request.user.id;
    const { userId, questionId, code, languageSlug } = submissionData;
    
    return this.submissionsService.createSubmission(
      userId,
      questionId,
      code,
      languageSlug,
    );
  }
} 