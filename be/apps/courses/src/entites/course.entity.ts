import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: '' })
  subtitle: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: 'draft' })
  status: 'draft' | 'published';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
