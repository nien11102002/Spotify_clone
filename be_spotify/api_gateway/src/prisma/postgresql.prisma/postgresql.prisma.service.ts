import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from './generated/postgresql';

@Injectable()
export class PostgresqlPrismaService
  extends PrismaClient
  implements OnModuleInit
{
  async onModuleInit() {
    await this.$connect();
  }
}
