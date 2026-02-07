import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionSource = 'CASH' | 'DEBIT_CARD' | 'CREDIT_CARD';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: ['INCOME', 'EXPENSE'],
  })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: ['CASH', 'DEBIT_CARD', 'CREDIT_CARD'],
    default: 'CASH',
  })
  source: TransactionSource;

  @Column()
  date: Date;

  @Column({ nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.transactions)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
