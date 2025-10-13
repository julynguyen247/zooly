import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Answer } from './answer.entity';

export type AttemptStatus = 'ongoing' | 'submitted' | 'expired' | 'cancelled';

@Entity('attempts')
@Index(['userId'])
@Index(['testSetId'])
export class Attempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  userId: string;
  @Column({ type: 'uuid' })
  testSetId: string;
  @Column({ type: 'varchar', length: 16, default: 'ongoing' })
  status: AttemptStatus;
  @Column({ type: 'int', default: 0 })
  rawListening: number;
  @Column({ type: 'int', default: 0 })
  rawReading: number;
  @Column({ type: 'int', default: 0 })
  scaledListening: number;
  @Column({ type: 'int', default: 0 })
  scaledReading: number;
  @Column({ type: 'int', default: 0 })
  total: number;
  @OneToMany(() => Answer, (a) => a.attempt, { cascade: true })
  answers: Answer[];
  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date | null;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
