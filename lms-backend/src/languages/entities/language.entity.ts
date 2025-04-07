import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Topic } from '../../topics/entities/topic.entity';

@Entity('languages')
export class Language {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  name: string; // e.g., 'Python', 'Java'

  @Column({ unique: true, length: 20 })
  slug: string; // e.g., 'python', 'java' (used for execution environments)

  // Relation: A language can have many topics
  @OneToMany(() => Topic, (topic) => topic.language)
  topics: Topic[];
} 