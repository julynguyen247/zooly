import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Choice } from './choice.entity';
import { TestSet } from './testset.entity';
import { Passage } from './passage.entity';
@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => TestSet, (q) => q.question)
  testSet: TestSet;
  @ManyToOne(() => Passage, { nullable: true })
  passage?: Passage;
  @Column()
  partNo: number;
  @Column()
  number: number;
  @Column({ type: 'text', nullable: true })
  stem?: string;
  @Column({ nullable: true })
  imageKey?: string;
  @Column({ nullable: true })
  audioKey?: string;
  @Column({ length: 1 })
  correct: 'A' | 'B' | 'C' | 'D';
  @Column({ type: 'text', nullable: true })
  explanation?: string;
  @OneToMany(() => Choice, (c) => c.question, { cascade: true })
  choices: Choice[];
}
