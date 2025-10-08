import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class Choice {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => Question, (q) => q.choices) question: Question;
  @Column({ length: 1 }) label: 'A' | 'B' | 'C' | 'D';
  @Column({ type: 'text', nullable: true }) text?: string;
  @Column({ nullable: true }) audioKey?: string;
}
