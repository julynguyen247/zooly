import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Attempt } from './attempt.entity';

export type PartType = 'listening' | 'reading';
@Entity('answers')
@Index(['attemptId', 'questionId'], { unique: true })
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Attempt, (a) => a.answers, { onDelete: 'CASCADE' })
  attempt: Attempt;
  @Column({ type: 'uuid' }) attemptId: string;
  @Column({ type: 'uuid' })
  questionId: string;
  @Column({ type: 'uuid', nullable: true })
  choiceId: string | null;
  @Column({ type: 'text', nullable: true })
  userAnswer: string | null;
  @Column({ type: 'varchar', length: 16 })
  part: PartType;
  @Column({ type: 'boolean', default: false })
  isCorrect: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
