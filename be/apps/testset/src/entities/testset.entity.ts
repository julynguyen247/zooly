import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class TestSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  code: string;
  @Column()
  title: string;
  @Column()
  durationSeconds: number;
  @OneToMany(() => Question, (q) => q.testSet, { cascade: true })
  question: Question[];
}
