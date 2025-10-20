import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('enrollments')
@Unique(['userId', 'courseId'])
export class Enrollment {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() userId: string;
  @Column() courseId: string;
  @Column({ default: true }) active: boolean;
  @CreateDateColumn() startedAt: Date;
}
