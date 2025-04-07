import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity('ratings')
@Unique(['userId', 'languageId']) // Ensure a user has only one rating per language
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  languageId: string;

  @Column({ type: 'int', default: 1000 }) // Elo-like rating system, starting at 1000
  score: number;

  @Column({ default: 0 })
  problemsSolved: number;

  @Column({ default: 0 })
  totalAttempts: number;

  @Column({ type: 'float', default: 0 })
  averageTime: number; // Average time in seconds per successful submission

  @Column({ type: 'float', default: 0 })
  accuracy: number; // Percentage of correct submissions (0-100)

  @Column({ type: 'jsonb', nullable: true })
  difficultyBreakdown: {
    easy: { attempted: number; solved: number };
    medium: { attempted: number; solved: number };
    hard: { attempted: number; solved: number };
  };

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;

  // Relation: A rating belongs to one user
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Relation: A rating is for one language
  @ManyToOne(() => Language)
  @JoinColumn({ name: 'languageId' })
  language: Language;
} 