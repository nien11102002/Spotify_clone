import { Controller, Get, Inject, Param } from '@nestjs/common';
import { SongService } from './song.service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRpcError } from 'src/common/helpers/catch-error.helper';

@Controller('song')
export class SongController {
  constructor(@Inject('SONG_NAME') private songService: ClientProxy) {}

  @Get('all-songs')
  async getAllSongs() {
    const songs = await lastValueFrom(
      this.songService.send('all-songs', {}).pipe(handleRpcError()),
    );

    return songs;
  }

  @Get('find-song/:id')
  async findSongById(@Param('id') id: string) {
    const song = await lastValueFrom(
      this.songService.send('find-song', { id }).pipe(handleRpcError()),
    );

    return song;
  }

  @Get('genre')
  async getAllGenres() {
    const genres = await lastValueFrom(
      this.songService.send('all-genres', {}).pipe(handleRpcError()),
    );

    return genres;
  }
}
