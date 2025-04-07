import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Assessment } from './assessment.entity';

@Entity('user_assessments')
export class UserAssessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  answers: any;

  @Column({ default: 0 })
  score: number;

  @Column({ default: false })
  isPassed: boolean;

  @Column({ default: 0 })
  attemptCount: number;

  @Column({ nullable: true })
  submittedAt: Date;

  @Column({ nullable: true })
  gradedAt: Date;

  @Column({ nullable: true, type: 'jsonb' })
  feedback: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Assessment, (assessment) => assessment.userAssessments)
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessment;
}
