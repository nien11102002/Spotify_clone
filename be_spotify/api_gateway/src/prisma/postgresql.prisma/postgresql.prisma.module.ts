import { Global, Module } from '@nestjs/common';
import { PostgresqlPrismaService } from './postgresql.prisma.service';

@Global()
@Module({
  exports: [PostgresqlPrismaService],
  providers: [PostgresqlPrismaService],
})
export class PostgresqlPrismaModule {}
