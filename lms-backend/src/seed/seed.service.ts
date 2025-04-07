import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LanguagesService } from '../languages/languages.service';
import { TopicsService } from '../topics/topics.service';
import { OpenaiService } from '../integration/openai.service';
import { mockTopics } from './mock-topics';
import { QuestionsService } from '../questions/questions.service';
import { DifficultyLevel } from '../questions/entities/question.entity';

interface TopicData {
  name: string;
  description: string;
}

// Define the languages to seed
const LANGUAGES_TO_SEED = [
    { name: 'Python', slug: 'python' },
    { name: 'Java', slug: 'java' },
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'C++', slug: 'cpp' },
];

const TOPICS_PER_LANGUAGE = 100;
const QUESTIONS_PER_TOPIC = 3; // Generate 3 questions per topic (1 easy, 1 medium, 1 hard)

// Mock questions for when OpenAI is unavailable
const mockQuestionTemplates = {
  [DifficultyLevel.EASY]: {
    title: 'Basic {{topic}}',
    description: 'Write a simple program that demonstrates {{topic}} in {{language}}.',
    testCases: [
      { input: 'sample input', expectedOutput: 'sample output' }
    ],
    timeLimit: '120', // 2 minutes
    pointsValue: 10
  },
  [DifficultyLevel.MEDIUM]: {
    title: 'Intermediate {{topic}}',
    description: 'Create a more complex implementation using {{topic}} in {{language}}.',
    testCases: [
      { input: 'sample input', expectedOutput: 'sample output' },
      { input: 'sample input 2', expectedOutput: 'sample output 2' }
    ],
    timeLimit: '300', // 5 minutes
    pointsValue: 20
  },
  [DifficultyLevel.HARD]: {
    title: 'Advanced {{topic}}',
    description: 'Solve this challenging problem using {{topic}} concepts in {{language}}.',
    testCases: [
      { input: 'sample input', expectedOutput: 'sample output' },
      { input: 'sample input 2', expectedOutput: 'sample output 2' },
      { input: 'sample input 3', expectedOutput: 'sample output 3' }
    ],
    timeLimit: '600', // 10 minutes
    pointsValue: 30
  }
};

@Injectable()
export class SeedService {
  constructor(
    private readonly configService: ConfigService,
    private readonly languagesService: LanguagesService,
    private readonly topicsService: TopicsService,
    private readonly questionsService: QuestionsService,
    private readonly openaiService: OpenaiService,
    private readonly logger: Logger,
  ) {}

  async runSeed() {
    // Check if seeding should run (e.g., only in development)
    const shouldSeed = this.configService.get<string>('RUN_SEEDER') === 'true';
    if (!shouldSeed) {
      this.logger.log('Skipping database seeding (RUN_SEEDER is not true).', 'SeedService');
      return;
    }

    this.logger.log('Starting database seeding...', 'SeedService');

    try {
      await this.seedLanguages();
      await this.seedTopics();
      await this.seedQuestions();

      this.logger.log('Database seeding completed successfully.', 'SeedService');
    } catch (error) {
      this.logger.error('Database seeding failed.', error instanceof Error ? error.stack : error, 'SeedService');
    }
  }

  private async seedLanguages(): Promise<void> {
    this.logger.log('Seeding languages...', 'SeedService');
    for (const langData of LANGUAGES_TO_SEED) {
        let lang = await this.languagesService.findBySlug(langData.slug);
        if (!lang) {
            lang = await this.languagesService.create(langData.name, langData.slug);
            this.logger.log(`Created language: ${lang.name}`, 'SeedService');
        } else {
            this.logger.log(`Language already exists: ${lang.name}`, 'SeedService');
        }
    }
    this.logger.log('Languages seeding finished.', 'SeedService');
  }

  private async seedTopics(): Promise<void> {
    this.logger.log('Seeding topics (using OpenAI if enabled)...', 'SeedService');

    const languages = await this.languagesService.findAll();
    let usingMockData = false;

    // Check if OpenAI is available
    if (!this.openaiService.isServiceEnabled()) {
        this.logger.warn('OpenAI service is disabled. Using mock topic data instead.', 'SeedService');
        usingMockData = true;
    }

    for (const language of languages) {
        this.logger.log(`Processing topics for ${language.name}...`, 'SeedService');
        
        // Check existing topics count first
        const existingTopics = await this.topicsService.findAll(language.id);
        if (existingTopics.length >= TOPICS_PER_LANGUAGE) {
             this.logger.log(`Skipping topic generation for ${language.name} - already has ${existingTopics.length} topics.`, 'SeedService');
             continue;
        }
        
        const neededTopics = TOPICS_PER_LANGUAGE - existingTopics.length;
        this.logger.log(`Generating ${neededTopics} new topics for ${language.name}...`, 'SeedService');
        
        let generatedTopics: TopicData[] = [];

        if (usingMockData) {
            // Use mock data based on language slug
            const slugToKey = {
                python: 'python',
                java: 'java',
                javascript: 'javascript',
                cpp: 'cpp',
            };
            
            const key = slugToKey[language.slug] || 'python'; // Default to python if not found
            const mockData = mockTopics[key] || [];
            
            // If we need more topics than we have in mock data, duplicate them
            while (generatedTopics.length < neededTopics) {
                for (const topic of mockData) {
                    if (generatedTopics.length < neededTopics) {
                        // Add a suffix to make duplicate topics unique
                        const suffix = generatedTopics.length > 0 ? ` ${Math.floor(generatedTopics.length / mockData.length) + 1}` : '';
                        generatedTopics.push({
                            name: topic.name + suffix,
                            description: topic.description,
                        });
                    } else {
                        break;
                    }
                }
            }
        } else {
            // Use OpenAI for topic generation
            generatedTopics = await this.openaiService.generateTopicsForLanguage(language.name, neededTopics);
        }

        if (!generatedTopics || generatedTopics.length === 0) {
            this.logger.warn(`No topics were generated for ${language.name}.`, 'SeedService');
            continue;
        }
        
        let createdCount = 0;
        for (const topicData of generatedTopics) {
            // Double-check if topic already exists (by name and language) before creating
            const exists = await this.topicsService.findByNameAndLanguage(topicData.name, language.id);
            if (!exists) {
                await this.topicsService.create(topicData.name, language, topicData.description);
                createdCount++;
            } else {
                 this.logger.log(`Topic "${topicData.name}" already exists for ${language.name}. Skipping.`, 'SeedService');
            }
        }
        this.logger.log(`Created ${createdCount} new topics for ${language.name}.`, 'SeedService');
    }
    this.logger.log('Topics seeding finished.', 'SeedService');
  }

  private async seedQuestions(): Promise<void> {
    this.logger.log('Seeding questions (using OpenAI if enabled)...', 'SeedService');

    // Get all topics from the database
    const topics = await this.topicsService.findAll();
    this.logger.log(`Found ${topics.length} topics to generate questions for.`, 'SeedService');

    let usingMockData = false;
    // Check if OpenAI is available
    if (!this.openaiService.isServiceEnabled()) {
      this.logger.warn(
        'OpenAI service is disabled. Using mock question data instead.',
        'SeedService',
      );
      usingMockData = true;
    }

    let totalQuestionsCreated = 0;

    // Process each topic
    for (const topic of topics) {
      // Get the language name for this topic
      const language = await this.languagesService.findOne(topic.languageId);
      if (!language) {
        this.logger.warn(`Could not find language for topic ${topic.name}. Skipping.`, 'SeedService');
        continue;
      }

      // Check if we already have questions for this topic
      const existingQuestions = await this.questionsService.findByTopic(topic.id);
      if (existingQuestions.length >= QUESTIONS_PER_TOPIC) {
        this.logger.log(
          `Skipping question generation for topic "${topic.name}" - already has ${existingQuestions.length} questions.`,
          'SeedService',
        );
        continue;
      }

      this.logger.log(`Generating questions for topic "${topic.name}" (${language.name})...`, 'SeedService');

      // Generate one question for each difficulty level
      for (const difficulty of Object.values(DifficultyLevel)) {
        // Check if we already have a question for this topic and difficulty
        const existingQuestion = existingQuestions.find(q => q.difficulty === difficulty);
        if (existingQuestion) {
          this.logger.log(
            `Skipping ${difficulty} question for topic "${topic.name}" - already exists.`,
            'SeedService',
          );
          continue;
        }

        try {
          let questionData;

          if (usingMockData) {
            // Generate a mock question based on templates
            const template = mockQuestionTemplates[difficulty];
            questionData = {
              title: template.title.replace('{{topic}}', topic.name),
              description: template.description
                .replace('{{topic}}', topic.name.toLowerCase())
                .replace('{{language}}', language.name),
              difficulty,
              testCases: template.testCases,
              timeLimit: template.timeLimit,
              pointsValue: template.pointsValue,
              hints: [`Think about ${topic.name.toLowerCase()} concepts in ${language.name}.`],
              topicId: topic.id,
            };
          } else {
            // Generate a question using OpenAI
            questionData = await this.generateQuestionWithOpenAI(
              topic.name,
              language.name,
              difficulty,
              topic.id,
            );
          }

          // Create the question in the database
          await this.questionsService.create(questionData);
          totalQuestionsCreated++;

          this.logger.log(
            `Created ${difficulty} question for topic "${topic.name}" (${language.name}).`,
            'SeedService',
          );
        } catch (error) {
          this.logger.error(
            `Error creating ${difficulty} question for topic "${topic.name}":`,
            error instanceof Error ? error.stack : error,
            'SeedService',
          );
        }
      }
    }

    this.logger.log(`Total questions created: ${totalQuestionsCreated}`, 'SeedService');
    this.logger.log('Questions seeding finished.', 'SeedService');
  }

  // Helper method to generate a question using OpenAI
  private async generateQuestionWithOpenAI(
    topicName: string,
    languageName: string,
    difficulty: DifficultyLevel,
    topicId: string,
  ): Promise<any> {
    try {
      // Call OpenAI to generate a question
      const prompt = `
        Create a coding question about ${topicName} in ${languageName} with ${difficulty} difficulty level.
        
        Return a JSON object with these fields:
        - title: A concise title for the question
        - description: Detailed problem description including example use cases
        - testCases: Array of objects with "input" and "expectedOutput" properties (3-5 test cases)
        - solution: An example correct solution in ${languageName}
        - hints: Array of strings with progressive hints (2-3 hints)
        - timeLimit: Suggested time limit in seconds (easy: 120-240, medium: 300-480, hard: 600-900)
        - pointsValue: Points worth (easy: 10, medium: 20, hard: 30)
      `;

      const completion = await this.openaiService.createCompletion(prompt);
      
      if (!completion) {
        throw new Error('OpenAI returned empty completion');
      }

      // Parse the response
      const responseJson = JSON.parse(completion);
      
      // Add the topicId to the response
      return {
        ...responseJson,
        difficulty,
        topicId,
      };
    } catch (error) {
      this.logger.error(
        `Error generating question with OpenAI for ${topicName} (${difficulty}):`,
        error instanceof Error ? error.stack : error,
        'SeedService',
      );
      
      // Fall back to mock data on error
      const template = mockQuestionTemplates[difficulty];
      return {
        title: template.title.replace('{{topic}}', topicName),
        description: template.description
          .replace('{{topic}}', topicName.toLowerCase())
          .replace('{{language}}', languageName),
        difficulty,
        testCases: template.testCases,
        timeLimit: template.timeLimit,
        pointsValue: template.pointsValue,
        hints: [`Think about ${topicName.toLowerCase()} concepts in ${languageName}.`],
        topicId,
      };
    }
  }
} 