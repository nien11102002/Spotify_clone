import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../node_modules/.prisma-mysql/client';

@Injectable()
export class MysqlPrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
