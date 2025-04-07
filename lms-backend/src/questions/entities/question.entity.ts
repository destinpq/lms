import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Topic } from '../../topics/entities/topic.entity';

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: DifficultyLevel,
    default: DifficultyLevel.MEDIUM,
  })
  difficulty: DifficultyLevel;

  @Column('jsonb', { nullable: true })
  testCases: any; // Store test cases as JSON

  @Column('text', { nullable: true })
  solution: string; // Example solution

  @Column()
  topicId: string;

  // Relation: A question belongs to one topic
  @ManyToOne(() => Topic)
  @JoinColumn({ name: 'topicId' })
  topic: Topic;

  @Column('text', { nullable: true })
  timeLimit: string; // Time limit for the question in seconds

  @Column('jsonb', { nullable: true })
  hints: string[]; // Array of hints for the question

  @Column({ default: 0 })
  pointsValue: number; // Points earned for solving this question
} 