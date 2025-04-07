import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { DifficultyLevel } from '../questions/entities/question.entity';

@Injectable()
export class RatingsService {
  private readonly logger = new Logger(RatingsService.name);

  // ELO-like rating constants
  private readonly K_FACTOR = 32; // Base factor for rating changes
  private readonly DIFFICULTY_MULTIPLIERS = {
    [DifficultyLevel.EASY]: 0.8,
    [DifficultyLevel.MEDIUM]: 1.0,
    [DifficultyLevel.HARD]: 1.5,
  };

  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
  ) {}

  async findAll(): Promise<Rating[]> {
    return this.ratingsRepository.find({
      relations: ['user', 'language'],
    });
  }

  async findByUser(userId: string): Promise<Rating[]> {
    return this.ratingsRepository.find({
      where: { userId },
      relations: ['language'],
    });
  }

  async findByLanguage(languageId: string): Promise<Rating[]> {
    return this.ratingsRepository.find({
      where: { languageId },
      relations: ['user'],
      order: { score: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Rating | null> {
    return this.ratingsRepository.findOne({
      where: { id },
      relations: ['user', 'language'],
    });
  }

  async findUserRatingForLanguage(userId: string, languageId: string): Promise<Rating | null> {
    return this.ratingsRepository.findOne({
      where: { userId, languageId },
    });
  }

  /**
   * Gets or creates a rating for a user in a specific language
   */
  async getOrCreateRating(userId: string, languageId: string): Promise<Rating> {
    let rating = await this.findUserRatingForLanguage(userId, languageId);
    
    if (!rating) {
      // Create a new rating with default values
      rating = this.ratingsRepository.create({
        userId,
        languageId,
        score: 1000, // Starting score
        problemsSolved: 0,
        totalAttempts: 0,
        averageTime: 0,
        accuracy: 0,
        difficultyBreakdown: {
          easy: { attempted: 0, solved: 0 },
          medium: { attempted: 0, solved: 0 },
          hard: { attempted: 0, solved: 0 },
        },
      });
      
      rating = await this.ratingsRepository.save(rating);
      this.logger.log(`Created new rating for user ${userId} in language ${languageId}`);
    }
    
    return rating;
  }

  /**
   * Updates a user's rating based on their performance on a question
   */
  async updateRating(
    userId: string,
    languageId: string,
    questionDifficulty: DifficultyLevel,
    success: boolean,
    executionTime: number,
  ): Promise<Rating> {
    // Get or create the rating
    const rating = await this.getOrCreateRating(userId, languageId);
    
    // Update attempts
    rating.totalAttempts += 1;
    
    // Update difficulty breakdown
    const difficulty = questionDifficulty.toLowerCase();
    if (!rating.difficultyBreakdown) {
      rating.difficultyBreakdown = {
        easy: { attempted: 0, solved: 0 },
        medium: { attempted: 0, solved: 0 },
        hard: { attempted: 0, solved: 0 },
      };
    }
    
    // Increment attempted count for this difficulty
    rating.difficultyBreakdown[difficulty].attempted += 1;
    
    if (success) {
      // Update problems solved
      rating.problemsSolved += 1;
      
      // Update solved count for this difficulty
      rating.difficultyBreakdown[difficulty].solved += 1;
      
      // Update average execution time
      // Formula: new_avg = ((old_avg * old_count) + new_time) / new_count
      const oldTimeSum = rating.averageTime * (rating.problemsSolved - 1);
      rating.averageTime = (oldTimeSum + executionTime) / rating.problemsSolved;
      
      // Update rating score using ELO-like system
      const difficultyMultiplier = this.DIFFICULTY_MULTIPLIERS[questionDifficulty] || 1.0;
      const ratingChange = Math.round(this.K_FACTOR * difficultyMultiplier);
      rating.score += ratingChange;
      
      this.logger.log(
        `User ${userId} solved a ${questionDifficulty} problem! New rating: ${rating.score} (+${ratingChange})`,
      );
    } else {
      // Penalty for wrong answer is half the potential gain
      const difficultyMultiplier = this.DIFFICULTY_MULTIPLIERS[questionDifficulty] || 1.0;
      const ratingChange = Math.round((this.K_FACTOR * difficultyMultiplier) / 2);
      rating.score = Math.max(0, rating.score - ratingChange); // Ensure rating doesn't go below 0
      
      this.logger.log(
        `User ${userId} failed a ${questionDifficulty} problem. New rating: ${rating.score} (-${ratingChange})`,
      );
    }
    
    // Update accuracy
    rating.accuracy = (rating.problemsSolved / rating.totalAttempts) * 100;
    
    // Update lastUpdated timestamp
    rating.lastUpdated = new Date();
    
    // Save and return the updated rating
    return this.ratingsRepository.save(rating);
  }

  /**
   * Determine the appropriate difficulty level for a user based on their rating
   */
  getDifficultyForRating(rating: number): DifficultyLevel {
    if (rating < 1200) {
      return DifficultyLevel.EASY;
    } else if (rating < 1800) {
      return DifficultyLevel.MEDIUM;
    } else {
      return DifficultyLevel.HARD;
    }
  }

  /**
   * Gets the leaderboard (top rated users) for a language
   */
  async getLeaderboard(languageId: string, limit: number = 10): Promise<Rating[]> {
    return this.ratingsRepository.find({
      where: { languageId },
      relations: ['user'],
      order: { score: 'DESC' },
      take: limit,
    });
  }
} 