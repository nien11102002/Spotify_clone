import { Controller, Get, Inject, Param } from '@nestjs/common';
import { SongService } from './song.service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRpcError } from 'src/common/helpers/catch-error.helper';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Public()
@ApiBearerAuth()
@Controller('song')
export class SongController {
  constructor(
    @Inject('SONG_NAME') private songService: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('search-song/:searchTerm')
  async searchSong(@Param('searchTerm') searchTerm: string) {
    console.log('API searchSong called', { searchTerm });

    const cacheKey = `searchSong:${searchTerm}`;
    const cachedSongs = await this.cacheManager.get(cacheKey);
    if (cachedSongs) return cachedSongs;

    const songs = await lastValueFrom(
      this.songService
        .send('search-song', { searchTerm })
        .pipe(handleRpcError()),
    );

    if (songs) this.cacheManager.set(cacheKey, songs, 300);

    return songs;
  }

  @Get('all-songs')
  async getAllSongs() {
    console.log('API getAllSongs called');

    const cacheKey = 'allSongs';
    const cachedSongs = await this.cacheManager.get(cacheKey);
    if (cachedSongs) return cachedSongs;

    const songs = await lastValueFrom(
      this.songService.send('all-songs', {}).pipe(handleRpcError()),
    );

    if (songs) this.cacheManager.set(cacheKey, songs, 300);

    return songs;
  }

  @Get('find-song/:id')
  async findSongById(@Param('id') id: string) {
    console.log('API findSongById called', { id });

    const cacheKey = `song:${id}`;
    const cachedSong = await this.cacheManager.get(cacheKey);
    if (cachedSong) return cachedSong;

    const song = await lastValueFrom(
      this.songService.send('find-song', { id }).pipe(handleRpcError()),
    );

    if (song) this.cacheManager.set(cacheKey, song, 300);

    return song;
  }

  @Get('genre')
  async getAllGenres() {
    console.log('API getAllGenres called');

    const cacheKey = 'allGenres';
    const cachedGenres = await this.cacheManager.get(cacheKey);
    if (cachedGenres) return cachedGenres;

    const genres = await lastValueFrom(
      this.songService.send('all-genres', {}).pipe(handleRpcError()),
    );

    if (genres) this.cacheManager.set(cacheKey, genres, 300);

    return genres;
  }

  @Get('play-music/:id')
  async playMusic(@Param('id') id: string) {
    console.log('API playMusic called', { id });

    const cacheKey = `playMusic:${id}`;
    const cachedSong = await this.cacheManager.get(cacheKey);
    if (cachedSong) return cachedSong;

    const song = await lastValueFrom(
      this.songService.send('play-music', { id }).pipe(handleRpcError()),
    );

    if (song) this.cacheManager.set(cacheKey, song, 300);

    return song;
  }
}
