import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'google_id', type: 'varchar', nullable: false })
  googleId: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', nullable: false })
  email: string | null;

  @Column({ type: 'varchar', nullable: true })
  displayName: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
