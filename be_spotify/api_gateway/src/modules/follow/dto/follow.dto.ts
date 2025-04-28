import { ApiProperty } from '@nestjs/swagger';

export class FollowDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  followingUserId: number;
}
