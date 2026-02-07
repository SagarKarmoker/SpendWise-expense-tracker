import { IsString, IsNumber, IsEnum, IsDateString, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ example: 100.50 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 'Grocery shopping' })
  @IsString()
  description: string;

  @ApiProperty({ enum: ['INCOME', 'EXPENSE'] })
  @IsEnum(['INCOME', 'EXPENSE'])
  type: 'INCOME' | 'EXPENSE';

  @ApiPropertyOptional({ enum: ['CASH', 'DEBIT_CARD', 'CREDIT_CARD'], default: 'CASH' })
  @IsOptional()
  @IsEnum(['CASH', 'DEBIT_CARD', 'CREDIT_CARD'])
  source?: 'CASH' | 'DEBIT_CARD' | 'CREDIT_CARD';

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'uuid-of-category' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}

export class UpdateTransactionDto {
  @ApiPropertyOptional({ example: 100.50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({ example: 'Grocery shopping' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ['INCOME', 'EXPENSE'] })
  @IsOptional()
  @IsEnum(['INCOME', 'EXPENSE'])
  type?: 'INCOME' | 'EXPENSE';

  @ApiPropertyOptional({ enum: ['CASH', 'DEBIT_CARD', 'CREDIT_CARD'] })
  @IsOptional()
  @IsEnum(['CASH', 'DEBIT_CARD', 'CREDIT_CARD'])
  source?: 'CASH' | 'DEBIT_CARD' | 'CREDIT_CARD';

  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ example: 'uuid-of-category' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
