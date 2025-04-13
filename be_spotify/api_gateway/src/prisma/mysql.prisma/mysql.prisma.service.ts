import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from './generated/mysql';

@Injectable()
export class MysqlPrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
