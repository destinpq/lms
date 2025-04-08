import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LanguagesService } from '../languages/languages.service';
import { TopicsService } from '../topics/topics.service';
import { OpenaiService } from '../integration/openai.service';
import { mockTopics } from './mock-topics';
import { QuestionsService } from '../questions/questions.service';
import { DifficultyLevel } from '../questions/entities/question.entity';
import { CoursesService } from '../courses/courses.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

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

// Mock courses for each programming language
const mockCourses = {
  python: [
    {
      title: 'Introduction to Python Programming',
      description: 'A comprehensive course covering the fundamentals of Python programming language. Learn syntax, data types, control structures, functions, and more.',
      duration: '8 weeks',
      level: 'Beginner',
      tags: ['Python', 'Programming', 'Beginner']
    },
    {
      title: 'Advanced Python Techniques',
      description: 'Take your Python skills to the next level with advanced concepts including decorators, generators, context managers, and metaprogramming.',
      duration: '6 weeks',
      level: 'Advanced',
      tags: ['Python', 'Advanced', 'Programming']
    },
    {
      title: 'Python for Data Science',
      description: 'Learn how to use Python for data analysis, visualization, and machine learning. Covers NumPy, Pandas, Matplotlib, and scikit-learn.',
      duration: '10 weeks',
      level: 'Intermediate',
      tags: ['Python', 'Data Science', 'Machine Learning']
    }
  ],
  java: [
    {
      title: 'Java Programming Essentials',
      description: 'Master the fundamentals of Java programming including object-oriented principles, data structures, exception handling, and more.',
      duration: '12 weeks',
      level: 'Beginner',
      tags: ['Java', 'Programming', 'Beginner']
    },
    {
      title: 'Java Enterprise Development',
      description: 'Learn to build enterprise applications with Java EE. Covers Servlets, JSP, JPA, Spring Framework, and Microservices architecture.',
      duration: '14 weeks',
      level: 'Advanced',
      tags: ['Java', 'Enterprise', 'Spring']
    }
  ],
  javascript: [
    {
      title: 'JavaScript Fundamentals',
      description: 'Build a strong foundation in JavaScript programming. Learn syntax, functions, objects, DOM manipulation, and asynchronous programming.',
      duration: '6 weeks',
      level: 'Beginner',
      tags: ['JavaScript', 'Web Development', 'Beginner']
    },
    {
      title: 'Modern JavaScript Frameworks',
      description: 'Master popular JavaScript frameworks like React, Vue, and Angular. Build interactive web applications with modern tooling.',
      duration: '8 weeks',
      level: 'Intermediate',
      tags: ['JavaScript', 'Frameworks', 'React', 'Vue', 'Angular']
    }
  ],
  cpp: [
    {
      title: 'C++ Programming Basics',
      description: 'Learn the fundamentals of C++ programming including syntax, data types, control structures, functions, and object-oriented programming.',
      duration: '10 weeks',
      level: 'Beginner',
      tags: ['C++', 'Programming', 'Beginner']
    },
    {
      title: 'Advanced C++ and System Programming',
      description: 'Dive into advanced C++ features and system-level programming. Covers templates, STL, memory management, multithreading, and performance optimization.',
      duration: '12 weeks',
      level: 'Advanced',
      tags: ['C++', 'System Programming', 'Advanced']
    }
  ]
};

@Injectable()
export class SeedService {
  constructor(
    private readonly configService: ConfigService,
    private readonly languagesService: LanguagesService,
    private readonly topicsService: TopicsService,
    private readonly questionsService: QuestionsService,
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
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
      // Skip question seeding - we'll generate questions on demand when students attempt them
      // await this.seedQuestions();
      
      // Check if course seeding is enabled
      const shouldSeedCourses = this.configService.get<string>('SEED_COURSES') === 'true';
      if (shouldSeedCourses) {
        await this.seedCourses();
      }

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

          // Create the question
          if (questionData) {
            await this.questionsService.create({
              title: questionData.title,
              description: questionData.description,
              difficulty: questionData.difficulty,
              testCases: questionData.testCases,
              timeLimit: questionData.timeLimit,
              pointsValue: questionData.pointsValue,
              topicId: topic.id,
            });
            totalQuestionsCreated++;
          }
        } catch (error) {
          this.logger.error(
            `Error creating ${difficulty} question for topic "${topic.name}"`,
            error instanceof Error ? error.stack : error,
            'SeedService',
          );
        }
      }
    }

    this.logger.log(`Created ${totalQuestionsCreated} questions total.`, 'SeedService');
    this.logger.log('Questions seeding finished.', 'SeedService');
  }

  private async generateQuestionWithOpenAI(
    topicName: string,
    languageName: string,
    difficulty: DifficultyLevel,
    topicId: string,
  ): Promise<any> {
    try {
      // Use OpenAI to generate question data
      return await this.openaiService.generateQuestion(topicName, languageName, difficulty);
    } catch (error) {
      this.logger.error(
        `Error generating question with OpenAI for "${topicName}" (${languageName})`,
        error instanceof Error ? error.stack : error,
        'SeedService',
      );
      return null;
    }
  }

  private async seedCourses(): Promise<void> {
    this.logger.log('Seeding courses...', 'SeedService');

    try {
      // Find or create admin user for course creation
      let adminUser = await this.usersService.findByEmail('admin@example.com');

      if (!adminUser) {
        adminUser = await this.usersService.create({
          email: 'admin@example.com',
          password: 'admin123',
          firstName: 'Admin',
          lastName: 'User',
          role: UserRole.ADMIN,
        });
        this.logger.log('Created admin user for course creation', 'SeedService');
      }

      // Get all languages
      const languages = await this.languagesService.findAll();
      
      for (const language of languages) {
        // Get mock courses for this language
        const slugToKey = {
          python: 'python',
          java: 'java',
          javascript: 'javascript',
          cpp: 'cpp',
        };
        
        const key = slugToKey[language.slug] || 'python';
        const languageCourses = mockCourses[key] || [];
        
        // Create courses for this language
        let coursesCreated = 0;
        for (const courseData of languageCourses) {
          // Check if course already exists
          const existingCourses = await this.coursesService.findAll();
          const exists = existingCourses.some(c => c.title === courseData.title);
          
          if (!exists) {
            await this.coursesService.create(
              {
                title: courseData.title,
                description: courseData.description,
                duration: courseData.duration,
                tags: courseData.tags,
                isPublished: true,
                hasCertificate: true,
                settings: {
                  level: courseData.level,
                  languages: [language.name],
                }
              },
              adminUser.id
            );
            coursesCreated++;
          } else {
            this.logger.log(`Course "${courseData.title}" already exists. Skipping.`, 'SeedService');
          }
        }
        
        this.logger.log(`Created ${coursesCreated} courses for ${language.name}`, 'SeedService');
      }
      
      this.logger.log('Courses seeding finished.', 'SeedService');
    } catch (error) {
      this.logger.error(
        'Error seeding courses',
        error instanceof Error ? error.stack : error,
        'SeedService',
      );
    }
  }
} 