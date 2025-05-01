import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        port: configService.get('REDIS_PORT'),
        host: configService.get('REDIS_HOST'),
        password: configService.get('REDIS_PASS'),
        ttl: parseInt(configService.get('REDIS_TTL') || '60'),
      }),
      inject: [ConfigService],

      isGlobal: true,
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
