import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question, DifficultyLevel } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  // Basic CRUD operations
  async findAll(): Promise<Question[]> {
    return this.questionsRepository.find();
  }

  async findOne(id: string): Promise<Question | null> {
    return this.questionsRepository.findOne({ where: { id } });
  }

  async create(questionData: Partial<Question>): Promise<Question> {
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

  // Method to get a random question by topic and difficulty
  async getRandomQuestion(topicId: string, difficulty: DifficultyLevel): Promise<Question | null> {
    const questions = await this.findByTopicAndDifficulty(topicId, difficulty);
    if (questions.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }

  // Method to get a question for a user (will be expanded in the rating system)
  async getQuestionForUser(userId: string, topicId: string): Promise<Question | null> {
    // For now, just return a random medium difficulty question
    // This will be expanded later when we implement the rating system
    return this.getRandomQuestion(topicId, DifficultyLevel.MEDIUM);
  }
} 