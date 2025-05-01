import { CACHE_KEY_METADATA, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
import { Public } from 'src/common/decorators/public.decorator';
import { handleRpcError } from 'src/common/helpers/catch-error.helper';

@Controller('comment')
export class CommentController {
  constructor(
    @Inject('COMMENT_NAME') private commentService: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Public()
  @Get('find-discuss/:id')
  async findDiscuss(@Param('id') id: string) {
    console.log('API findDiscuss called', { id });
    const cacheKey = `discuss_${id}`;
    const cachedDiscuss = await this.cacheManager.get(cacheKey);
    if (cachedDiscuss) return cachedDiscuss;
    const discussResult = await lastValueFrom(
      this.commentService.send('find-discuss', { id }).pipe(handleRpcError()),
    );

    if (discussResult) this.cacheManager.set(cacheKey, discussResult, 5 * 60);

    return discussResult;
  }
}
