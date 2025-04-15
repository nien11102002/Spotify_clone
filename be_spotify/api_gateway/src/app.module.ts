import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MysqlPrismaModule } from './prisma/mysql.prisma/mysql.prisma.module';
import { PostgresqlPrismaService } from './prisma/postgresql.prisma/postgresql.prisma.service';
import { PostgresqlPrismaModule } from './prisma/postgresql.prisma/postgresql.prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MysqlPrismaService } from './prisma/mysql.prisma/mysql.prisma.service';

@Module({
  imports: [
    MysqlPrismaModule,
    PostgresqlPrismaModule,
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PostgresqlPrismaService, MysqlPrismaService],
})
export class AppModule {}
