import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions for current user' })
  async findAll(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.transactionsService.findAll(req.user.userId, { startDate, endDate });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.transactionsService.findOne(id, req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  async create(@Body() createDto: CreateTransactionDto, @Request() req) {
    return this.transactionsService.create(createDto, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTransactionDto,
    @Request() req,
  ) {
    return this.transactionsService.update(id, updateDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.transactionsService.remove(id, req.user.userId);
  }
}
