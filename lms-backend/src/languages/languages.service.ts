import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './entities/language.entity';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private languagesRepository: Repository<Language>,
  ) {}

  // Basic CRUD methods can be added here later

  async findAll(): Promise<Language[]> {
    return this.languagesRepository.find();
  }

  async findOne(id: string): Promise<Language | null> {
    return this.languagesRepository.findOne({ where: { id } });
  }

  // Method needed for seeding
  async findBySlug(slug: string): Promise<Language | null> {
    return this.languagesRepository.findOne({ where: { slug } });
  }

  // Method needed for seeding
  async create(name: string, slug: string): Promise<Language> {
    const newLanguage = this.languagesRepository.create({ name, slug });
    return this.languagesRepository.save(newLanguage);
  }
} 