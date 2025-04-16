import { Controller } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessagePattern } from '@nestjs/microservices';

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
}
