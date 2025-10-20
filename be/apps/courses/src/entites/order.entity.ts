import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() userId: string;
  @Column({ default: 'pending' })
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  @Column('int') totalAmount: number;
  @Column({ default: 'VND' }) currency: string;
  @Column({ nullable: true }) paymentProvider?: string;
  @Column({ nullable: true }) providerSessionId?: string;
  @Column({ nullable: true }) providerPaymentId?: string;
  @CreateDateColumn() createdAt: Date;
}
@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => Order, { onDelete: 'CASCADE' }) @JoinColumn() order: Order;
  @Column() courseId: string;
  @Column('int') unitAmount: number;
  @Column('int', { default: 1 }) quantity: number;
}
