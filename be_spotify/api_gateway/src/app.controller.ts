import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Public } from './common/decorators/public.decorator';

@Public()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('get-cache')
  getHello() {
    const cacheValue = this.cacheManager.get('test');
    return cacheValue;
  }

  @Get('set-cache')
  setCache() {
    this.cacheManager.set('test', { value: 'test', number: 1 });
    return `Cache set for key: test`;
  }
}
