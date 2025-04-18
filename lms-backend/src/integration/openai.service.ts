import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { DifficultyLevel } from '../questions/entities/question.entity';

// Interface for the expected structure of a topic from OpenAI
interface OpenAiTopic {
  name: string;
  description: string;
}

// Interface for question data
export interface QuestionData {
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  testCases: Array<{ input: string; expectedOutput: string }>;
  timeLimit: string;
  pointsValue: number;
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

  /**
   * Checks if the OpenAI service is enabled and available
   * @returns True if the service is enabled, false otherwise
   */
  isServiceEnabled(): boolean {
    // For testing/development, always return true even without API key
    return process.env.NODE_ENV === 'development' || !!this.openai;
  }

  /**
   * Simulates question generation with mock data (for testing without OpenAI)
   */
  private simulateQuestionGeneration(
    topicName: string,
    languageName: string,
    difficulty: DifficultyLevel,
  ): QuestionData {
    // Create mock test cases
    const testCases = [
      {
        input: "test input 1",
        expectedOutput: "expected output 1",
      },
      {
        input: "test input 2",
        expectedOutput: "expected output 2",
      },
      {
        input: "test input 3",
        expectedOutput: "expected output 3",
      },
    ];

    // Generate different point values based on difficulty
    let pointsValue = 10;
    let timeLimit = "180";
    
    if (difficulty === DifficultyLevel.MEDIUM) {
      pointsValue = 20;
      timeLimit = "300";
    } else if (difficulty === DifficultyLevel.HARD) {
      pointsValue = 30;
      timeLimit = "600";
    }

    return {
      title: `${difficulty} ${topicName} Challenge in ${languageName}`,
      description: `This is a ${difficulty.toLowerCase()} level coding challenge about ${topicName} in ${languageName}. Write a program that solves the following problem...`,
      difficulty,
      testCases,
      timeLimit,
      pointsValue,
    };
  }

  /**
   * Generates a question for a specific topic and difficulty level
   * @param topicName - The name of the topic
   * @param languageName - The programming language
   * @param difficulty - The difficulty level
   * @returns Question data or null if generation fails
   */
  async generateQuestion(
    topicName: string,
    languageName: string,
    difficulty: DifficultyLevel,
  ): Promise<QuestionData | null> {
    if (!this.isServiceEnabled()) {
      this.logger.warn(
        'OpenAI Service is disabled or not initialized. Cannot generate question.',
      );
      return null;
    }

    // If running in development and no API key, use mock data
    if (process.env.NODE_ENV === 'development' && !this.openai) {
      this.logger.log(
        'Using simulated question generation (no OpenAI API key available)',
      );
      return this.simulateQuestionGeneration(topicName, languageName, difficulty);
    }

    try {
      const prompt = `
        Create a coding question about ${topicName} in ${languageName} with ${difficulty} difficulty level.
        
        Return a JSON object with these fields:
        - title: A concise title for the question
        - description: Detailed problem description including example use cases
        - testCases: Array of objects with "input" and "expectedOutput" properties (3-5 test cases)
        - timeLimit: Suggested time limit in seconds (easy: 120-240, medium: 300-480, hard: 600-900)
        - pointsValue: Points worth (easy: 10, medium: 20, hard: 30)
      `;

      const content = await this.createCompletion(prompt);
      
      if (!content) {
        throw new Error('OpenAI returned empty completion');
      }

      // Parse the response
      const responseJson = JSON.parse(content);
      
      // Add the difficulty to the response
      return {
        ...responseJson,
        difficulty,
      };
    } catch (error) {
      this.logger.error(
        `Error generating question with OpenAI for ${topicName} (${difficulty}):`,
        error instanceof Error ? error.stack : error,
        'OpenaiService',
      );
      return null;
    }
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