import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MysqlPrismaModule } from './prisma/mysql.prisma/mysql.prisma.module';
import { PostgresqlPrismaService } from './prisma/postgresql.prisma/postgresql.prisma.service';
import { PostgresqlPrismaModule } from './prisma/postgresql.prisma/postgresql.prisma.module';

@Module({
  imports: [MysqlPrismaModule, PostgresqlPrismaModule],
  controllers: [AppController],
  providers: [AppService, PostgresqlPrismaService],
})
export class AppModule {}
