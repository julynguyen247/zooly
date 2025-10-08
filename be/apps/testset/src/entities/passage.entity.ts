import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TestSet } from './testset.entity';
import { Question } from './question.entity';

@Entity()
export class Passage {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() partNo: number;
  @Column({ type: 'text', nullable: true }) script?: string;
  @Column({ nullable: true }) audioKey?: string;
  @ManyToOne(() => TestSet) testSet: TestSet;
  @OneToMany(() => Question, (q) => q.passage)
  questions: Question[];
}
