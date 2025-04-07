import { Controller, Get } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { Language } from './entities/language.entity';

@Controller('languages') // Route prefix e.g., /api/languages
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Get()
  findAll(): Promise<Language[]> {
    return this.languagesService.findAll();
  }

  // Other endpoints (e.g., GetById) can be added later
} 