import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Assessment } from './assessment.entity';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  FILL_IN_BLANK = 'fill_in_blank',
  ESSAY = 'essay',
  MATCHING = 'matching',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.MULTIPLE_CHOICE,
  })
  type: QuestionType;

  @Column({ type: 'jsonb' })
  options: any;

  @Column({ type: 'jsonb', nullable: true })
  correctAnswer: any;

  @Column({ default: 1 })
  points: number;

  @Column({ default: 'medium' })
  difficulty: string;

  @Column({ nullable: true })
  hint: string;

  @Column({ default: false })
  isOptional: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Assessment, (assessment) => assessment.questions)
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;
}
