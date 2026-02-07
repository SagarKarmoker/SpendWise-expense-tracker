import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(userId: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { userId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id, userId },
    });
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    
    return category;
  }

  async create(data: CreateCategoryDto, userId: string): Promise<Category> {
    const existing = await this.categoryRepository.findOne({
      where: { name: data.name, userId },
    });

    if (existing) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = this.categoryRepository.create({
      ...data,
      userId,
    });
    return this.categoryRepository.save(category);
  }

  async update(id: string, data: UpdateCategoryDto, userId: string): Promise<Category> {
    const category = await this.findOne(id, userId);
    
    if (data.name && data.name !== category.name) {
      const existing = await this.categoryRepository.findOne({
        where: { name: data.name, userId },
      });
      if (existing) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    Object.assign(category, data);
    return this.categoryRepository.save(category);
  }

  async remove(id: string, userId: string): Promise<void> {
    const category = await this.findOne(id, userId);
    await this.categoryRepository.remove(category);
  }

  async createDefaults(userId: string): Promise<void> {
    const defaults = [
      { name: 'Food & Dining', color: '#FF5733', icon: 'utensils', type: 'EXPENSE' as const },
      { name: 'Transportation', color: '#3498DB', icon: 'car', type: 'EXPENSE' as const },
      { name: 'Shopping', color: '#9B59B6', icon: 'shopping-bag', type: 'EXPENSE' as const },
      { name: 'Entertainment', color: '#E74C3C', icon: 'film', type: 'EXPENSE' as const },
      { name: 'Bills & Utilities', color: '#F39C12', icon: 'zap', type: 'EXPENSE' as const },
      { name: 'Health', color: '#1ABC9C', icon: 'heart', type: 'EXPENSE' as const },
      { name: 'Education', color: '#2ECC71', icon: 'book', type: 'EXPENSE' as const },
      { name: 'Rent', color: '#E67E22', icon: 'home', type: 'EXPENSE' as const },
      { name: 'Salary', color: '#27AE60', icon: 'briefcase', type: 'INCOME' as const },
      { name: 'Freelance', color: '#2980B9', icon: 'laptop', type: 'INCOME' as const },
      { name: 'Investments', color: '#8E44AD', icon: 'trending-up', type: 'INCOME' as const },
      { name: 'Other Income', color: '#16A085', icon: 'plus-circle', type: 'INCOME' as const },
    ];

    const categories = defaults.map((d) =>
      this.categoryRepository.create({ ...d, userId }),
    );
    await this.categoryRepository.save(categories);
  }
}
