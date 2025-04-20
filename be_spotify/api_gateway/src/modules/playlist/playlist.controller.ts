import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { CreatePlayListDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { handleRpcError } from 'src/common/helpers/catch-error.helper';
import { AddSongToPlaylistDto } from './dto/add-song-to-playlist.dto';

@Controller('playlist')
export class PlaylistController {
  constructor(@Inject('PLAYLIST_NAME') private playlistService: ClientProxy) {}

  @Get('get-all-playlists')
  async getAllPlaylists() {
    const allPlaylists = await lastValueFrom(
      this.playlistService.send('get-all-playlists', {}).pipe(handleRpcError()),
    );
    return allPlaylists;
  }

  @Get('get-playlists-of-user')
  async getPlaylistOfUser(@Query('id') id: string) {
    const userPlaylist = await lastValueFrom(
      this.playlistService
        .send({ cmd: 'get_playlist_of_user' }, { id })
        .pipe(handleRpcError()),
    );
    return userPlaylist;
  }

  @Get('get-playlist-detail/:id')
  async getPlaylistDetail(@Param() id: string) {
    const userPlaylist = await lastValueFrom(
      this.playlistService
        .send('get-playlist-detail', { id })
        .pipe(handleRpcError()),
    );
    return userPlaylist;
  }

  @Get('get-song-in-playlist/:playlistId')
  async getSongInPlaylist(@Param('playlistId') playlistId: string) {
    const songsInPlaylist = await lastValueFrom(
      this.playlistService
        .send('get-song-in-playlist', { playlistId })
        .pipe(handleRpcError()),
    );
    return songsInPlaylist;
  }

  @Post('add-playlist')
  async addPlaylist(@Body() createPlaylistDto: CreatePlayListDto) {
    const newPlaylist = await lastValueFrom(
      this.playlistService
        .send('add-playlist', { createPlaylistDto })
        .pipe(handleRpcError()),
    );
    return newPlaylist;
  }

  @Post('add-song-to-playlist')
  async addSongToPlaylist(@Body() addSongToPlaylistDto: AddSongToPlaylistDto) {
    const result = await lastValueFrom(
      this.playlistService
        .send('add_song_to_playlist', {
          addSongToPlaylistDto,
        })
        .pipe(handleRpcError()),
    );
  }

  @Post('create-playlist')
  async createPlaylist(@Body() createPlaylistDto: CreatePlayListDto) {
    const newPlaylist = await lastValueFrom(
      this.playlistService
        .send('create_playlist', { createPlaylistDto })
        .pipe(handleRpcError()),
    );

    return newPlaylist;
  }

  @Put('edit-playlist/:playlistId')
  async editPlaylist(
    @Param('playlistId') playlistId: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    const userPlaylist = await lastValueFrom(
      this.playlistService
        .send('edit-playlist', { playlistId, updatePlaylistDto })
        .pipe(
          catchError((err) => {
            const { statusCode = 500, message = 'Internal server error' } = err;
            return throwError(() => new HttpException(message, statusCode));
          }),
        ),
    );
    return userPlaylist;
  }

  @Delete('remove-playlist/:id')
  async removePlaylist(@Param('id') id: string) {
    const result = await lastValueFrom(
      this.playlistService
        .send('remove-playlist', { id })
        .pipe(handleRpcError()),
    );
    return result;
  }
}
