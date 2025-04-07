import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BadgeType {
  COURSE_COMPLETION = 'course_completion',
  MODULE_COMPLETION = 'module_completion',
  QUIZ_PERFORMANCE = 'quiz_performance',
  ACTIVITY_STREAK = 'activity_streak',
  ENGAGEMENT = 'engagement',
  ACHIEVEMENT = 'achievement',
}

@Entity('badges')
export class Badge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  icon: string;

  @Column({
    type: 'enum',
    enum: BadgeType,
    default: BadgeType.ACHIEVEMENT,
  })
  type: BadgeType;

  @Column({ type: 'jsonb' })
  criteria: any;

  @Column({ default: 0 })
  points: number;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
