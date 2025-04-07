import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Question } from '../../questions/entities/question.entity';

export enum SubmissionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  ACCEPTED = 'accepted',
  WRONG_ANSWER = 'wrong_answer',
  TIME_LIMIT_EXCEEDED = 'time_limit_exceeded',
  RUNTIME_ERROR = 'runtime_error',
}

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  questionId: string;

  @Column('text')
  code: string;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING,
  })
  status: SubmissionStatus;

  @Column('text', { nullable: true })
  languageSlug: string; // e.g., 'python', 'java', 'javascript', 'cpp'

  @Column('float', { nullable: true })
  executionTime: number; // Time taken in seconds

  @Column('jsonb', { nullable: true })
  results: any; // Store results of test cases

  @Column('text', { nullable: true })
  feedback: string; // Feedback on the submission

  @Column({ default: 0 })
  score: number; // Score for this submission

  @CreateDateColumn()
  submittedAt: Date;

  // Relation: A submission belongs to one user
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Relation: A submission is for one question
  @ManyToOne(() => Question)
  @JoinColumn({ name: 'questionId' })
  question: Question;
} 