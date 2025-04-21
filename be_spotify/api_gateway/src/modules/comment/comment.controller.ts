import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRpcError } from 'src/common/helpers/catch-error.helper';

@Controller('comment')
export class CommentController {
  constructor(@Inject('COMMENT_NAME') private commentService: ClientProxy) {}

  @Get('find-discuss/:id')
  async findDiscuss(@Param('id') id: string) {
    const discussResult = await lastValueFrom(
      this.commentService.send('find-discuss', { id }).pipe(handleRpcError()),
    );
  }
}
