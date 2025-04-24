import {
  BadGatewayException,
  BadRequestException,
  Controller,
  Get,
} from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { TUserAccount } from 'types/type';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller()
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @MessagePattern('login')
  async login(@Payload() data) {
    const { identifier, password } = data;

    const userExists = await this.prisma.users.findFirst({
      where: {
        account: identifier,
      },
      select: {
        id: true,
        password: true,
        name: true,
        account: true,
      },
    });
    if (!userExists)
      throw new RpcException({
        statusCode: 400,
        message: 'User not exist, please register!',
      });

    const passHash = userExists.password;
    const isPassword = bcrypt.compareSync(password, passHash);
    if (!isPassword)
      throw new RpcException({
        statusCode: 502,
        message: 'Wrong password or account!',
      });

    const tokens = this.createTokens(userExists);

    return {
      tokens,
      userId: userExists.id,
      userName: userExists.name,
      account: userExists.account,
    };
  }

  createTokens(userExists: TUserAccount) {
    const accessToken = this.jwtService.sign(
      { user_id: userExists.id },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES'),
      },
    );

    const refreshToken = this.jwtService.sign(
      { user_id: userExists.id },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES'),
      },
    );

    return { accessToken, refreshToken };
  }

  @MessagePattern('register')
  async register(@Payload() data) {
    const { password, account, repassword } = data;

    var userExists = await this.prisma.users.findFirst({
      where: {
        OR: [{ account: account }],
      },
    });
    if (userExists)
      throw new RpcException({
        statusCode: 400,
        message: 'Account already exists',
      });

    if (password !== repassword)
      throw new RpcException({
        statusCode: 502,
        message: 'Not similar password',
      });

    const hashPassword = bcrypt.hashSync(password, 10);

    const userNew = await this.prisma.users.create({
      data: {
        account: account,
        password: hashPassword,
        name: 'test',
      },
      select: {
        id: true,
        account: true,
        name: true,
      },
    });

    const tokens = this.createTokens(userNew);

    return { tokens, userNew };
  }
}
