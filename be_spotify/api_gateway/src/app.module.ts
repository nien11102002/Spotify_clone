import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MysqlPrismaModule } from './prisma/mysql.prisma/mysql.prisma.module';
import { PostgresqlPrismaService } from './prisma/postgresql.prisma/postgresql.prisma.service';
import { PostgresqlPrismaModule } from './prisma/postgresql.prisma/postgresql.prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MysqlPrismaService } from './prisma/mysql.prisma/mysql.prisma.service';
import { FriendModule } from './modules/friend/friend.module';
import { FollowModule } from './modules/follow/follow.module';
import { CommentModule } from './modules/comment/comment.module';
import { PlaylistModule } from './modules/playlist/playlist.module';
import { ConfigModule } from '@nestjs/config';
import { MessageModule } from './modules/message/message.module';
import { SongModule } from './modules/song/song.module';

@Module({
  imports: [
    MysqlPrismaModule,
    PostgresqlPrismaModule,
    AuthModule,
    UserModule,
    FriendModule,
    FollowModule,
    CommentModule,
    PlaylistModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MessageModule,
    SongModule,
  ],
  controllers: [AppController],
  providers: [AppService, PostgresqlPrismaService, MysqlPrismaService],
})
export class AppModule {}
