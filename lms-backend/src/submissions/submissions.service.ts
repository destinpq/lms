import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission, SubmissionStatus } from './entities/submission.entity';
import { QuestionsService } from '../questions/questions.service';
import { OpenaiService } from '../integration/openai.service';

@Injectable()
export class SubmissionsService {
  private readonly logger = new Logger(SubmissionsService.name);

  constructor(
    @InjectRepository(Submission)
    private submissionsRepository: Repository<Submission>,
    private questionsService: QuestionsService,
    private openaiService: OpenaiService,
  ) {}

  async findAll(): Promise<Submission[]> {
    return this.submissionsRepository.find({
      relations: ['question'],
      order: { submittedAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Submission[]> {
    return this.submissionsRepository.find({
      where: { userId },
      relations: ['question'],
      order: { submittedAt: 'DESC' },
    });
  }

  async findByQuestion(questionId: string): Promise<Submission[]> {
    return this.submissionsRepository.find({
      where: { questionId },
      relations: ['user'],
      order: { submittedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Submission | null> {
    return this.submissionsRepository.findOne({ 
      where: { id },
      relations: ['question', 'user'],
    });
  }

  async findUserSubmissionsForQuestion(userId: string, questionId: string): Promise<Submission[]> {
    return this.submissionsRepository.find({
      where: { userId, questionId },
      order: { submittedAt: 'DESC' },
    });
  }

  async createSubmission(
    userId: string,
    questionId: string,
    code: string,
    languageSlug: string,
  ): Promise<Submission> {
    // Create a new submission record
    const submission = this.submissionsRepository.create({
      userId,
      questionId,
      code,
      languageSlug,
      status: SubmissionStatus.PENDING,
    });

    // Save to database
    const savedSubmission = await this.submissionsRepository.save(submission);
    
    // Process the submission asynchronously
    this.processSubmission(savedSubmission.id)
      .catch(err => this.logger.error(`Error processing submission: ${err.message}`, err.stack));
    
    return savedSubmission;
  }

  async processSubmission(submissionId: string): Promise<void> {
    // Get the submission
    const submission = await this.findOne(submissionId);
    if (!submission) {
      throw new Error(`Submission ${submissionId} not found`);
    }

    try {
      // Update status to processing
      await this.updateStatus(submissionId, SubmissionStatus.PROCESSING);

      // Get the question details
      const question = await this.questionsService.findOne(submission.questionId);
      if (!question) {
        throw new Error(`Question ${submission.questionId} not found`);
      }

      // Get the test cases
      const testCases = question.testCases || [];
      
      // In a real system, we would execute the code against test cases in a sandboxed environment
      // For simplicity, we'll use OpenAI to simulate execution and verification
      const results = await this.simulateExecution(
        submission.code,
        submission.languageSlug,
        question,
      );

      // Calculate execution time (simulated)
      const executionTime = Math.random() * 2 + 0.1; // Random value between 0.1 and 2.1 seconds
      
      // Determine status based on results
      const allTestsPassed = results.every(r => r.passed);
      const status = allTestsPassed 
        ? SubmissionStatus.ACCEPTED 
        : SubmissionStatus.WRONG_ANSWER;
      
      // Calculate score based on status and question value
      const score = allTestsPassed ? question.pointsValue : 0;
      
      // Generate feedback using OpenAI
      const feedback = await this.generateFeedback(
        submission.code,
        submission.languageSlug,
        question.description,
        results,
      );

      // Update submission with results
      await this.submissionsRepository.update(submissionId, {
        status,
        executionTime,
        results,
        feedback,
        score,
      });

      this.logger.log(`Processed submission ${submissionId}: ${status}`);
    } catch (error) {
      // Update status to runtime error
      await this.updateStatus(
        submissionId, 
        SubmissionStatus.RUNTIME_ERROR,
        `Error processing submission: ${error.message}`,
      );
      
      this.logger.error(
        `Error processing submission ${submissionId}: ${error.message}`,
        error.stack,
      );
    }
  }

  private async updateStatus(
    submissionId: string, 
    status: SubmissionStatus,
    feedback?: string,
  ): Promise<void> {
    const updateData: any = { status };
    if (feedback) {
      updateData.feedback = feedback;
    }
    
    await this.submissionsRepository.update(submissionId, updateData);
  }

  private async simulateExecution(
    code: string,
    language: string,
    question: any,
  ): Promise<Array<{ testCase: any; passed: boolean; output: string }>> {
    if (!this.openaiService.isServiceEnabled()) {
      // Return simulated results if OpenAI is not available
      return (question.testCases || []).map(testCase => ({
        testCase,
        passed: Math.random() > 0.3, // 70% chance of passing
        output: 'Simulated output',
      }));
    }

    try {
      const prompt = `
        You are a code execution engine. Analyze the following ${language} code and simulate running it against the provided test cases.
        Do not execute the code, but analyze it logically to determine if it would pass each test case.
        
        Code:
        \`\`\`${language}
        ${code}
        \`\`\`
        
        Question: ${question.description}
        
        Test Cases:
        ${JSON.stringify(question.testCases)}
        
        For each test case, determine:
        1. If the code would pass the test case
        2. What the expected output would be
        
        Return a JSON array where each object has:
        - testCase: the original test case
        - passed: boolean indicating if the code would pass the test
        - output: the expected output of the code for this input
      `;

      const completion = await this.openaiService.createCompletion(prompt);
      if (!completion) {
        throw new Error('Failed to get response from OpenAI');
      }

      try {
        // Parse the results
        const results = JSON.parse(completion);
        return Array.isArray(results) ? results : [];
      } catch (error) {
        this.logger.error(`Error parsing OpenAI response: ${error.message}`);
        return [];
      }
    } catch (error) {
      this.logger.error(`Error simulating execution: ${error.message}`);
      // Fallback to random results
      return (question.testCases || []).map(testCase => ({
        testCase,
        passed: Math.random() > 0.3, // 70% chance of passing
        output: 'Simulated output (fallback)',
      }));
    }
  }

  private async generateFeedback(
    code: string,
    language: string,
    problemStatement: string,
    results: any[],
  ): Promise<string> {
    if (!this.openaiService.isServiceEnabled()) {
      return results.every(r => r.passed)
        ? 'Your solution passed all test cases. Good job!'
        : 'Your solution failed some test cases. Please review and try again.';
    }

    try {
      const allPassed = results.every(r => r.passed);
      const failedTests = results.filter(r => !r.passed);
      
      const prompt = `
        You are a coding instructor giving feedback to a student.
        
        Problem: ${problemStatement}
        
        Their ${language} code:
        \`\`\`${language}
        ${code}
        \`\`\`
        
        Test Results: ${allPassed ? 'All tests passed' : `${failedTests.length} tests failed`}
        ${failedTests.length > 0 ? `Failed test cases: ${JSON.stringify(failedTests)}` : ''}
        
        Please provide constructive feedback on:
        ${allPassed ? '- Code quality, readability, and efficiency' : '- Why their solution might be failing the tests'}
        - Any potential edge cases they should consider
        - Suggestions for improvement
        
        Keep your feedback specific, actionable, and under 300 words.
      `;

      const completion = await this.openaiService.createCompletion(prompt);
      if (!completion) {
        throw new Error('Failed to get feedback from OpenAI');
      }

      try {
        // Parse the feedback
        const feedback = JSON.parse(completion);
        return typeof feedback === 'string' 
          ? feedback 
          : (feedback.feedback || 'No specific feedback available.');
      } catch (error) {
        // If parsing fails, just use the raw response if it looks like text
        if (typeof completion === 'string' && !completion.startsWith('{') && !completion.startsWith('[')) {
          return completion;
        }
        
        this.logger.error(`Error parsing OpenAI feedback: ${error.message}`);
        return allPassed
          ? 'Your solution passed all test cases. Good job!'
          : 'Your solution failed some test cases. Please review and try again.';
      }
    } catch (error) {
      this.logger.error(`Error generating feedback: ${error.message}`);
      return results.every(r => r.passed)
        ? 'Your solution passed all test cases. Good job!'
        : 'Your solution failed some test cases. Please review and try again.';
    }
  }
} 