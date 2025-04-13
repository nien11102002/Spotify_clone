import { Global, Module } from '@nestjs/common';
import { MysqlPrismaService } from './mysql.prisma.service';

@Global()
@Module({
  exports: [MysqlPrismaService],
  providers: [MysqlPrismaService],
})
export class MysqlPrismaModule {}
