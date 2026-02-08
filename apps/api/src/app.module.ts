import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST || 'localhost',
      port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DATABASE_URL ? undefined : process.env.DB_USERNAME || 'spendtracker',
      password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD || 'spendtracker',
      database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME || 'spendtracker',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Disabled for production safety
      logging: false,
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
      extra: {
        max: 5, // Limit connection pool for serverless
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      },
    }),
    HealthModule,
    AuthModule,
    UsersModule,
    TransactionsModule,
    CategoriesModule,
  ],
})
export class AppModule { }
