import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question, DifficultyLevel } from './entities/question.entity';
import { OpenaiService, QuestionData } from '../integration/openai.service';
import { TopicsService } from '../topics/topics.service';
import { LanguagesService } from '../languages/languages.service';

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);

  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
    private readonly openaiService: OpenaiService,
    private readonly topicsService: TopicsService,
    private readonly languagesService: LanguagesService,
  ) {}

  // Basic CRUD operations
  async findAll(): Promise<Question[]> {
    return this.questionsRepository.find();
  }

  async findOne(id: string): Promise<Question | null> {
    return this.questionsRepository.findOne({ where: { id } });
  }

  // This method is now primarily for saving questions *after* they've been attempted
  async create(questionData: Partial<Question>): Promise<Question> {
    const existingQuestion = await this.questionsRepository.findOne({ 
        where: { title: questionData.title, topicId: questionData.topicId }
    });
    if (existingQuestion) {
        this.logger.log(`Question with title "${questionData.title}" already exists for this topic. Returning existing.`);
        return existingQuestion;
    }
    this.logger.log(`Creating new question: ${questionData.title}`);
    const question = this.questionsRepository.create(questionData);
    return this.questionsRepository.save(question);
  }

  async update(id: string, questionData: Partial<Question>): Promise<Question | null> {
    await this.questionsRepository.update(id, questionData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.questionsRepository.delete(id);
  }

  // Advanced query methods
  async findByTopic(topicId: string): Promise<Question[]> {
    return this.questionsRepository.find({ where: { topicId } });
  }

  async findByDifficulty(difficulty: DifficultyLevel): Promise<Question[]> {
    return this.questionsRepository.find({ where: { difficulty } });
  }

  async findByTopicAndDifficulty(
    topicId: string,
    difficulty: DifficultyLevel,
  ): Promise<Question[]> {
    return this.questionsRepository.find({
      where: { topicId, difficulty },
    });
  }

  // Method to get a question: try finding existing, otherwise generate on demand (don't save)
  async getOrCreateQuestion(
    topicId: string, 
    difficulty: DifficultyLevel
  ): Promise<Question | Partial<Question> | null> {
    const questions = await this.findByTopicAndDifficulty(topicId, difficulty);
    if (questions.length > 0) {
      // Return a random existing saved question
      const randomIndex = Math.floor(Math.random() * questions.length);
      this.logger.log(`Returning existing question for topic ${topicId}`);
      return questions[randomIndex];
    }
    
    // No existing question found, generate one on-demand but don't save it yet
    this.logger.log(`No existing question found for topic ${topicId}. Generating on demand...`);
    return this.generateQuestionOnDemand(topicId, difficulty);
  }

  // Method to get a question for a user (uses getOrCreateQuestion)
  async getQuestionForUser(userId: string, topicId: string): Promise<Question | Partial<Question> | null> {
    // TODO: Implement logic based on user rating to determine difficulty
    // For now, just get/generate a medium difficulty question
    this.logger.log(`Getting question for user ${userId}, topic ${topicId}`);
    return this.getOrCreateQuestion(topicId, DifficultyLevel.MEDIUM);
  }

  // Generate a question on-demand using OpenAI - DOES NOT SAVE
  async generateQuestionOnDemand(
      topicId: string, 
      difficulty: DifficultyLevel
  ): Promise<Partial<Question> | null> {
    this.logger.log(`Attempting OpenAI generation for topic ${topicId}, difficulty ${difficulty}`);
    try {
      // Get topic and language info
      const topic = await this.topicsService.findOne(topicId);
      if (!topic) {
        this.logger.error(`Topic with ID ${topicId} not found for generation`);
        return null;
      }

      const language = await this.languagesService.findOne(topic.languageId);
      if (!language) {
        this.logger.error(`Language with ID ${topic.languageId} not found for generation`);
        return null;
      }

      // Generate question using OpenAI
      const questionData: QuestionData | null = await this.openaiService.generateQuestion(
        topic.name,
        language.name,
        difficulty
      );

      if (!questionData) {
        this.logger.error(`Failed to generate question from OpenAI for topic ${topic.name}`);
        return null;
      }

      // Return the generated data as a partial Question object, without an ID (as it's not saved)
      const partialQuestion: Partial<Question> = {
        title: questionData.title,
        description: questionData.description,
        difficulty: questionData.difficulty,
        testCases: questionData.testCases,
        timeLimit: questionData.timeLimit,
        pointsValue: questionData.pointsValue,
        topicId: topicId, // Include topicId for context
        // No 'id' field here
      };

      this.logger.log(`Generated question data via OpenAI: ${partialQuestion.title}`);
      return partialQuestion;
    } catch (error) {
      this.logger.error(
        `Error during on-demand question generation for topic ${topicId}: ${error.message}`,
        error.stack
      );
      return null;
    }
  }
} 