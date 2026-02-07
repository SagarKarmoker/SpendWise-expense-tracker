import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async findAll(userId: string, filters?: { startDate?: string; endDate?: string }) {
    const where: any = { userId };
    
    if (filters?.startDate && filters?.endDate) {
      where.date = Between(new Date(filters.startDate), new Date(filters.endDate));
    }

    return this.transactionRepository.find({
      where,
      relations: ['category'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });
    
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    
    return transaction;
  }

  async create(data: CreateTransactionDto, userId: string): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...data,
      userId,
    });
    return this.transactionRepository.save(transaction);
  }

  async update(id: string, data: UpdateTransactionDto, userId: string): Promise<Transaction> {
    const transaction = await this.findOne(id, userId);
    Object.assign(transaction, data);
    return this.transactionRepository.save(transaction);
  }

  async remove(id: string, userId: string): Promise<void> {
    const transaction = await this.findOne(id, userId);
    await this.transactionRepository.remove(transaction);
  }

  async getSummary(userId: string, startDate: Date, endDate: Date) {
    const transactions = await this.transactionRepository.find({
      where: {
        userId,
        date: Between(startDate, endDate),
      },
    });

    const income = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }
}
