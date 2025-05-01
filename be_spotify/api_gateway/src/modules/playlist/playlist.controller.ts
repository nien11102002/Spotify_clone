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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@ApiBearerAuth()
@Controller('playlist')
export class PlaylistController {
  constructor(
    @Inject('PLAYLIST_NAME') private playlistService: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Public()
  @Get('get-all-playlists')
  async getAllPlaylists() {
    console.log('API get-all-playlists called');

    const cacheKey = 'allPlaylists';
    const cachedPlaylists = await this.cacheManager.get(cacheKey);
    if (cachedPlaylists) return cachedPlaylists;

    const allPlaylists = await lastValueFrom(
      this.playlistService.send('get-all-playlists', {}).pipe(handleRpcError()),
    );

    if (allPlaylists) this.cacheManager.set(cacheKey, allPlaylists, 300);

    return allPlaylists;
  }

  @Public()
  @Get('get-playlists-of-user')
  async getPlaylistOfUser(@Query('id') id: string) {
    console.log('API get-playlists-of-user called', { id });
    const cacheKey = `userPlaylists:${id}`;
    const cachedUserPlaylists = await this.cacheManager.get(cacheKey);
    if (cachedUserPlaylists) return cachedUserPlaylists;

    const userPlaylist = await lastValueFrom(
      this.playlistService
        .send('get-playlists-of-user', { id })
        .pipe(handleRpcError()),
    );
    if (userPlaylist) this.cacheManager.set(cacheKey, userPlaylist, 300);
    return userPlaylist;
  }

  @Public()
  @Get('get-playlist-detail/:id')
  async getPlaylistDetail(@Param('id') id: string) {
    console.log('API get-playlist-detail called', { id });
    const cacheKey = `playlistDetail:${id}`;
    const cachedDetail = await this.cacheManager.get(cacheKey);
    if (cachedDetail) return cachedDetail;

    const userPlaylist = await lastValueFrom(
      this.playlistService
        .send('get-playlist-detail', { id })
        .pipe(handleRpcError()),
    );
    if (userPlaylist) this.cacheManager.set(cacheKey, userPlaylist, 300);
    return userPlaylist;
  }

  @Public()
  @Get('get-song-in-playlist/:playlistId')
  async getSongInPlaylist(@Param('playlistId') playlistId: string) {
    console.log('API get-song-in-playlist called', { playlistId });
    const cacheKey = `songsInPlaylist:${playlistId}`;
    const cachedSongs = await this.cacheManager.get(cacheKey);
    if (cachedSongs) return cachedSongs;

    const songsInPlaylist = await lastValueFrom(
      this.playlistService
        .send('get-song-in-playlist', { playlistId })
        .pipe(handleRpcError()),
    );
    if (songsInPlaylist) this.cacheManager.set(cacheKey, songsInPlaylist, 300);
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
    // Invalidate related caches
    this.cacheManager.del('allPlaylists');
    if (createPlaylistDto.userId) {
      this.cacheManager.del(`userPlaylists:${createPlaylistDto.userId}`);
    }
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
    // Invalidate songs in playlist cache
    if (addSongToPlaylistDto.playlistId) {
      this.cacheManager.del(
        `songsInPlaylist:${addSongToPlaylistDto.playlistId}`,
      );
      this.cacheManager.del(
        `playlistDetail:${addSongToPlaylistDto.playlistId}`,
      );
    }
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
    // Invalidate related caches
    this.cacheManager.del('allPlaylists');
    if (createPlaylistDto.userId) {
      this.cacheManager.del(`userPlaylists:${createPlaylistDto.userId}`);
    }
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
    // Invalidate caches for this playlist
    await this.cacheManager.del('allPlaylists');
    await this.cacheManager.del(`playlistDetail:${id}`);
    await this.cacheManager.del(`songsInPlaylist:${id}`);
    // Optionally, if you know the userId, also delete userPlaylists:userId
    return result;
  }
}
