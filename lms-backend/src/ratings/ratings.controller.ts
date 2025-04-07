import { Controller, Get, Param, Query } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { Rating } from './entities/rating.entity';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Get()
  async findAll(@Query('userId') userId?: string, @Query('languageId') languageId?: string): Promise<Rating[]> {
    if (userId && languageId) {
      const rating = await this.ratingsService.findUserRatingForLanguage(userId, languageId);
      return rating ? [rating] : [];
    }
    
    if (userId) {
      return this.ratingsService.findByUser(userId);
    }
    
    if (languageId) {
      return this.ratingsService.findByLanguage(languageId);
    }
    
    return this.ratingsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Rating | null> {
    return this.ratingsService.findOne(id);
  }

  @Get('user/:userId/language/:languageId')
  async findUserRatingForLanguage(
    @Param('userId') userId: string,
    @Param('languageId') languageId: string,
  ): Promise<Rating> {
    const rating = await this.ratingsService.findUserRatingForLanguage(userId, languageId);
    if (!rating) {
      // Create a new rating if it doesn't exist
      return this.ratingsService.getOrCreateRating(userId, languageId);
    }
    return rating;
  }

  @Get('leaderboard/:languageId')
  async getLeaderboard(
    @Param('languageId') languageId: string,
    @Query('limit') limit?: number,
  ): Promise<Rating[]> {
    return this.ratingsService.getLeaderboard(languageId, limit);
  }
} 