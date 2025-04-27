import { Controller, Get, Inject, Param } from '@nestjs/common';
import { SongService } from './song.service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRpcError } from 'src/common/helpers/catch-error.helper';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Public()
@ApiBearerAuth()
@Controller('song')
export class SongController {
  constructor(@Inject('SONG_NAME') private songService: ClientProxy) {}

  @Get('all-songs')
  async getAllSongs() {
    console.log('API getAllSongs called');
    const songs = await lastValueFrom(
      this.songService.send('all-songs', {}).pipe(handleRpcError()),
    );

    return songs;
  }

  @Get('find-song/:id')
  async findSongById(@Param('id') id: string) {
    console.log('API findSongById called', { id });
    const song = await lastValueFrom(
      this.songService.send('find-song', { id }).pipe(handleRpcError()),
    );

    return song;
  }

  @Get('genre')
  async getAllGenres() {
    console.log('API getAllGenres called');
    const genres = await lastValueFrom(
      this.songService.send('all-genres', {}).pipe(handleRpcError()),
    );

    return genres;
  }

  @Get('play-music/:id')
  async playMusic(@Param('id') id: string) {
    console.log('API playMusic called', { id });
    const song = await lastValueFrom(
      this.songService.send('play-music', { id }).pipe(handleRpcError()),
    );

    return song;
  }
}
