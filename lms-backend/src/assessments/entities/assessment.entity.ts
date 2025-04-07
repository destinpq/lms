import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { Module } from '../../courses/entities/module.entity';
import { Question } from './question.entity';
import { UserAssessment } from './user-assessment.entity';

export enum AssessmentType {
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment',
  PROJECT = 'project',
  EXAM = 'exam',
}

@Entity('assessments')
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: AssessmentType,
    default: AssessmentType.QUIZ,
  })
  type: AssessmentType;

  @Column({ default: 0 })
  totalPoints: number;

  @Column({ default: 0 })
  passingScore: number;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ nullable: true })
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Course, (course) => course.assessments)
  course: Course;

  @ManyToOne(() => Module, { nullable: true })
  @JoinColumn({ name: 'module_id' })
  module: Module;

  @OneToMany(() => Question, (question) => question.assessment, {
    cascade: true,
  })
  questions: Question[];

  @OneToMany(
    () => UserAssessment,
    (userAssessment) => userAssessment.assessment,
  )
  userAssessments: UserAssessment[];
}
