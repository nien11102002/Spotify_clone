import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TUser } from 'src/common/types/types';
import { PostgresqlPrismaService } from 'src/prisma/postgresql.prisma/postgresql.prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, `jwt`) {
  constructor(
    private configService: ConfigService,
    private prisma: PostgresqlPrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: any) {
    // console.log(`validate`);
    // console.log({ payload });
    const user: TUser = await this.prisma.users.findUnique({
      where: { id: Number(payload.user_id) },
      select: {
        account: true,
        id: true,
        name: true,
        avatar: true,
        banner: true,
        description: true,
        refresh_token: true,
        role: true,
      },
    });

    // console.log(user);
    return user;
  }
}
