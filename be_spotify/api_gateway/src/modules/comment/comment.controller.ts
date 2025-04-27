import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Public } from 'src/common/decorators/public.decorator';
import { handleRpcError } from 'src/common/helpers/catch-error.helper';

@Controller('comment')
export class CommentController {
  constructor(@Inject('COMMENT_NAME') private commentService: ClientProxy) {}

  @Public()
  @Get('find-discuss/:id')
  async findDiscuss(@Param('id') id: string) {
    console.log('API findDiscuss called', { id });
    const discussResult = await lastValueFrom(
      this.commentService.send('find-discuss', { id }).pipe(handleRpcError()),
    );

    return discussResult;
  }
}
