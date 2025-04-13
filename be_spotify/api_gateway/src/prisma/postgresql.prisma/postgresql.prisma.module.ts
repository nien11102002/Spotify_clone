import { Global, Module } from '@nestjs/common';
import { PostgresqlPrismaService } from './postgresql.prisma.service';

@Global()
@Module({})
export class PostgresqlPrismaModule {
  export: [PostgresqlPrismaService];
  provider: [PostgresqlPrismaService];
}
