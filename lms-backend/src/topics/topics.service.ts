import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { Language } from '../languages/entities/language.entity'; // Import Language

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private topicsRepository: Repository<Topic>,
  ) {}

  async findAll(languageId?: string): Promise<Topic[]> {
    if (languageId) {
      return this.topicsRepository.find({ where: { languageId } });
    }
    return this.topicsRepository.find();
  }

  // Method needed for seeding
  async create(
    name: string,
    language: Language,
    description?: string,
  ): Promise<Topic> {
    const newTopic = this.topicsRepository.create({ 
      name,
      language, // Pass the whole Language object
      description, 
    });
    return this.topicsRepository.save(newTopic);
  }

  // Optional: Method to find topic by name within a language (useful for seeding to avoid duplicates)
  async findByNameAndLanguage(
    name: string,
    languageId: string,
  ): Promise<Topic | null> {
    return this.topicsRepository.findOne({ where: { name, languageId } });
  }
} 