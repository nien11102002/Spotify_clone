import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TUser } from '../types/types';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
