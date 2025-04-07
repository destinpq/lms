import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Module } from './module.entity';

export enum ContentType {
  TEXT = 'text',
  VIDEO = 'video',
  AUDIO = 'audio',
  PDF = 'pdf',
  IMAGE = 'image',
  LINK = 'link',
  EMBED = 'embed',
  HTML = 'html',
}

@Entity('module_contents')
export class ModuleContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ContentType,
    default: ContentType.TEXT,
  })
  type: ContentType;

  @Column({ type: 'jsonb' })
  content: Record<string, unknown>;

  @Column({ default: 0 })
  order: number;

  @Column({ default: false })
  isRequired: boolean;

  @Column({ nullable: true })
  duration: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Module, (module) => module.content)
  @JoinColumn({ name: 'module_id' })
  module: Module;
}
