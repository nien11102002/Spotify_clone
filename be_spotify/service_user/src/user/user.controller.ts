import { Controller } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @MessagePattern('all-users')
  async getAllUsers() {
    try {
      const allUsers = await this.prisma.users.findMany();
      return allUsers;
    } catch (err) {
      throw err;
    }
  }

  @MessagePattern('find-user')
  async findUserById(@Payload() data) {
    const id = +data.id;
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });
    }

    const formattedUser = {
      userId: user.id,
      name: user.name,
      nationality: user.nationality,
      channelName: user.channel_name,
      avatar: user.avatar,
      description: user.description,
      banner: user.banner,
      role: user.role,
    };

    return formattedUser;
  }
}
