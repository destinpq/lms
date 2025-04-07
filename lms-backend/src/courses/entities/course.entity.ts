import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Module } from './module.entity';
import { Assessment } from '../../assessments/entities/assessment.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ default: 0 })
  enrollmentCount: number;

  @Column({ nullable: true })
  duration: string;

  @Column({ type: 'simple-array', default: '' })
  tags: string[];

  @Column({ default: false })
  hasCertificate: boolean;

  @Column({ nullable: true })
  certificateTemplate: string;

  @Column({ nullable: true, type: 'jsonb' })
  settings: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.createdCourses)
  @JoinColumn({ name: 'instructor_id' })
  instructor: User;

  @ManyToMany(() => User, (user) => user.enrolledCourses)
  students: User[];

  @OneToMany(() => Module, (module) => module.course, { cascade: true })
  modules: Module[];

  @OneToMany(() => Assessment, (assessment) => assessment.course, {
    cascade: true,
  })
  assessments: Assessment[];
}
