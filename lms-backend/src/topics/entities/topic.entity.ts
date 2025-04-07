import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Language } from '../../languages/entities/language.entity';
// import { Question } from '../../questions/entities/question.entity'; // Uncomment later

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g., 'Variables', 'Loops', 'Functions', 'Classes'

  @Column('text', { nullable: true })
  description: string;

  @Column()
  languageId: string; // Foreign key column

  // Relation: A topic belongs to one language
  @ManyToOne(() => Language, language => language.topics)
  @JoinColumn({ name: 'languageId' })
  language: Language;

  // Relation: A topic can have many questions
  // Note: The Question entity definition needs to be created later
  // @OneToMany(() => Question, question => question.topic)
  // questions: Question[];
} 