import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

// Interface for the expected structure of a topic from OpenAI
interface OpenAiTopic {
  name: string;
  description: string;
}

@Injectable()
export class OpenaiService implements OnModuleInit {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(OpenaiService.name);
  private isEnabled = false;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      this.logger.warn(
        'OpenAI API key is not configured. OpenAI features will be disabled.',
      );
      this.isEnabled = false;
    } else {
      try {
        this.openai = new OpenAI({ apiKey });
        this.isEnabled = true;
        this.logger.log('OpenAI Service Initialized.');
      } catch (error) {
        this.logger.error('Failed to initialize OpenAI client', error);
        this.isEnabled = false;
        this.openai = null;
      }
    }
  }

  isServiceEnabled(): boolean {
    return this.isEnabled && this.openai !== null;
  }

  /**
   * Generates a list of topics for a given programming language.
   */
  async generateTopicsForLanguage(
    languageName: string,
    count: number,
  ): Promise<OpenAiTopic[]> {
    if (!this.isServiceEnabled()) {
      this.logger.warn(
        'OpenAI Service is disabled or not initialized. Returning empty topic list.',
      );
      return [];
    }

    try {
      const client = this.openai as OpenAI;
      
      const completion = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert curriculum developer. Generate a list of ${count} core programming topics for the ${languageName} language, suitable for a learning platform. Focus on fundamental concepts progressing to slightly more advanced ones. Format the response strictly as a JSON array of objects, where each object has a "name" (string, concise topic title) and a "description" (string, brief 1-sentence explanation). Example: [{ "name": "Variables", "description": "Learn how to store data using variables in ${languageName}." }]`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        this.logger.error('OpenAI returned empty content');
        return [];
      }

      try {
        const parsed = JSON.parse(content);
        const topics = Array.isArray(parsed) ? parsed : parsed.topics || [];
        
        return topics
          .filter((topic: any) => 
            topic && typeof topic.name === 'string' && typeof topic.description === 'string'
          )
          .map((topic: any) => ({
            name: topic.name,
            description: topic.description,
          }))
          .slice(0, count);
      } catch (parseError) {
        this.logger.error('Failed to parse OpenAI response', parseError);
        return [];
      }
    } catch (error) {
      this.logger.error(`Error generating topics for ${languageName}:`, error);
      return [];
    }
  }

  /**
   * Creates a completion for a text prompt
   * @param prompt - The prompt to get a completion for
   * @returns The completion text or null if unavailable
   */
  async createCompletion(prompt: string): Promise<string | null> {
    if (!this.isServiceEnabled()) {
      this.logger.warn(
        'OpenAI Service is disabled or not initialized. Cannot create completion.',
      );
      return null;
    }

    try {
      const client = this.openai as OpenAI;
      
      const completion = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides structured responses in a valid JSON format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        this.logger.error('OpenAI returned empty content');
        return null;
      }

      return content;
    } catch (error) {
      this.logger.error(`Error creating completion:`, error);
      return null;
    }
  }
} 