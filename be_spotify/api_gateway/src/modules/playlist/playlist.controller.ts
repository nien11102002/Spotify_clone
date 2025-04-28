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
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('playlist')
export class PlaylistController {
  constructor(@Inject('PLAYLIST_NAME') private playlistService: ClientProxy) {}

  @Public()
  @Get('get-all-playlists')
  async getAllPlaylists() {
    console.log('API get-all-playlists called');
    const allPlaylists = await lastValueFrom(
      this.playlistService.send('get-all-playlists', {}).pipe(handleRpcError()),
    );
    return allPlaylists;
  }

  @Public()
  @Get('get-playlists-of-user')
  async getPlaylistOfUser(@Query('id') id: string) {
    console.log('API get-playlists-of-user called', { id });
    const userPlaylist = await lastValueFrom(
      this.playlistService
        .send('get-playlists-of-user', { id })
        .pipe(handleRpcError()),
    );
    return userPlaylist;
  }

  @Public()
  @Get('get-playlist-detail/:id')
  async getPlaylistDetail(@Param('id') id: string) {
    console.log('API get-playlist-detail called', { id });
    const userPlaylist = await lastValueFrom(
      this.playlistService
        .send('get-playlist-detail', { id })
        .pipe(handleRpcError()),
    );
    return userPlaylist;
  }

  @Public()
  @Get('get-song-in-playlist/:playlistId')
  async getSongInPlaylist(@Param('playlistId') playlistId: string) {
    console.log('API get-song-in-playlist called', { playlistId });
    const songsInPlaylist = await lastValueFrom(
      this.playlistService
        .send('get-song-in-playlist', { playlistId })
        .pipe(handleRpcError()),
    );
    return songsInPlaylist;
  }

  @Post('add-playlist')
  async addPlaylist(@Body() createPlaylistDto: CreatePlayListDto) {
    console.log('API add-playlist called', { createPlaylistDto });
    const newPlaylist = await lastValueFrom(
      this.playlistService
        .send('add-playlist', { createPlaylistDto })
        .pipe(handleRpcError()),
    );
    return newPlaylist;
  }

  @Post('add-song-to-playlist')
  async addSongToPlaylist(@Body() addSongToPlaylistDto: AddSongToPlaylistDto) {
    console.log('API add-song-to-playlist called', { addSongToPlaylistDto });
    const result = await lastValueFrom(
      this.playlistService
        .send('add-song-to-playlist', {
          addSongToPlaylistDto,
        })
        .pipe(handleRpcError()),
    );

    return result;
  }

  @Post('create-playlist')
  async createPlaylist(@Body() createPlaylistDto: CreatePlayListDto) {
    console.log('API create-playlist called', { createPlaylistDto });
    const newPlaylist = await lastValueFrom(
      this.playlistService
        .send('create-playlist', { createPlaylistDto })
        .pipe(handleRpcError()),
    );

    return newPlaylist;
  }

  @Put('edit-playlist/:playlistId')
  async editPlaylist(
    @Param('playlistId') playlistId: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    console.log('API edit-playlist called', { playlistId, updatePlaylistDto });
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
    console.log('API remove-playlist called', { id });
    const result = await lastValueFrom(
      this.playlistService
        .send('remove-playlist', { id })
        .pipe(handleRpcError()),
    );
    return result;
  }
}
