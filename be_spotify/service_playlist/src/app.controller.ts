import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @MessagePattern('get-all-playlists')
  async getAllPlaylists(@Payload() data) {
    const allPlaylists = await this.prisma.playlists.findMany({
      include: {
        users: true,
        playlist_songs: true,
      },
    });
    return allPlaylists;
  }

  @MessagePattern('get-playlists-of-user')
  async getPlaylistOfUser(@Payload() data) {
    const id = +data.id;
    console.log('API get-playlists-of-user called', { id });
    const existUser = await this.prisma.users.findUnique({
      where: { id: id },
    });

    if (!existUser) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });
    }

    const userPlaylist = await this.prisma.playlists.findMany({
      where: {
        user_id: id,
      },
    });

    const formatReturn = userPlaylist.map((playlist) => {
      return {
        id: playlist.id,
        userId: playlist.user_id,
        playlistName: playlist.playlist_name,
        description: playlist.description,
        createDate: playlist.create_date,
      };
    });

    return formatReturn;
  }

  @MessagePattern('get-playlist-detail')
  async getPlaylistDetail(@Payload() data) {
    const id = +data.id;
    console.log('API get-playlist-detail called', { id });

    const existPlaylist = await this.prisma.playlists.findUnique({
      where: { id: id },
      include: {
        playlist_songs: { include: { songs: true } },
      },
    });

    if (!existPlaylist) {
      throw new RpcException({
        statusCode: 404,
        message: 'Playlist not found',
      });
    }

    const formatReturn = {
      id: existPlaylist.id,
      playlistName: existPlaylist.playlist_name,
      description: existPlaylist.description,
      imagePath: existPlaylist.image_path,
      userId: existPlaylist.user_id,
      createDate: existPlaylist.create_date,
      updatedAt: existPlaylist.updated_at,
      PlaylistSongs: existPlaylist.playlist_songs.map((song) => {
        return {
          songId: song.song_id,
          Song: {
            songId: song.song_id,
            songName: song.songs.song_name,
            genreId: song.songs.genre_id,
            publicDate: song.songs.public_date,
            duration: song.songs.duration,
            songImage: song.songs.song_image,
            userId: song.songs.user_id,
          },
        };
      }),
    };

    return formatReturn;
  }

  @MessagePattern('get-song-in-playlist')
  async getSongInPlaylist(@Payload() data) {
    const playlistId = +data.playlistId;

    const existPlaylist = await this.prisma.playlists.findUnique({
      where: { id: playlistId },
    });

    if (!existPlaylist) {
      throw new RpcException({
        statusCode: 404,
        message: 'Playlist not found',
      });
    }

    const playlist_songs = await this.prisma.playlist_songs.findMany({
      where: { playlist_id: playlistId },
      include: {
        songs: true,
      },
    });

    return playlist_songs;
  }

  @MessagePattern('add-playlist')
  async addPlaylist(@Payload() data) {
    const { createPlaylistDto } = data;
    const { userId, playlistName, description } = createPlaylistDto;

    const existUser = await this.prisma.users.findUnique({
      where: { id: +userId },
    });

    if (!existUser) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });
    }

    const newPlaylist = await this.prisma.playlists.create({
      data: {
        user_id: +userId,
        playlist_name: playlistName,
        description: description,
      },
    });

    return newPlaylist;
  }

  @MessagePattern('add-song-to-playlist')
  async addSongToPlaylist(@Payload() data) {
    const { addSongToPlaylistDto } = data;
    const { playlistId, songId } = addSongToPlaylistDto;

    const existPlaylist = await this.prisma.playlists.findUnique({
      where: { id: +playlistId },
    });

    const existSongInPlaylist = await this.prisma.playlist_songs.findFirst({
      where: { playlist_id: +playlistId, song_id: +songId },
    });

    if (existSongInPlaylist) {
      throw new RpcException({
        statusCode: 400,
        message: 'Song already exists in playlist',
      });
    }

    if (!existPlaylist) {
      throw new RpcException({
        statusCode: 404,
        message: 'Playlist not found',
      });
    }

    const existSong = await this.prisma.songs.findUnique({
      where: { id: +songId },
    });

    if (!existSong) {
      throw new RpcException({
        statusCode: 404,
        message: 'Song not found',
      });
    }

    const newPlaylistSong = await this.prisma.playlist_songs.create({
      data: {
        playlist_id: +playlistId,
        song_id: +songId,
      },
    });

    return newPlaylistSong;
  }

  @MessagePattern('create-playlist')
  async createPlaylist(@Payload() data) {
    const { createPlaylistDto } = data;
    const { userId, playlistName, description, imagePath } = createPlaylistDto;

    const existUser = await this.prisma.users.findUnique({
      where: { id: +userId },
    });

    const existedPlaylist = await this.prisma.playlists.findFirst({
      where: { playlist_name: playlistName, user_id: +userId },
    });

    if (!existUser) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });
    }

    if (existedPlaylist) {
      throw new RpcException({
        statusCode: 400,
        message: 'Playlist name already exists',
      });
    }

    const newPlaylist = await this.prisma.playlists.create({
      data: {
        user_id: +userId,
        playlist_name: playlistName,
        description: description,
        image_path: imagePath,
      },
    });

    return newPlaylist;
  }

  @MessagePattern('edit-playlist')
  async editPlaylist(@Payload() data) {
    const { playlistId, updatePlaylistDto } = data;
    const { playlistName, description, imagePath } = updatePlaylistDto;

    const existPlaylist = await this.prisma.playlists.findUnique({
      where: { id: +playlistId },
    });

    if (!existPlaylist) {
      throw new RpcException({
        statusCode: 404,
        message: 'Playlist not found',
      });
    }

    const updatedPlaylist = await this.prisma.playlists.update({
      where: { id: +playlistId },
      data: {
        playlist_name: playlistName,
        description: description,
        image_path: imagePath,
      },
    });

    return updatedPlaylist;
  }

  @MessagePattern('remove-playlist')
  async deletePlaylist(@Payload() data) {
    const { id } = data;

    const existPlaylist = await this.prisma.playlists.findUnique({
      where: { id: +id },
    });

    if (!existPlaylist) {
      throw new RpcException({
        statusCode: 404,
        message: 'Playlist not found',
      });
    }

    await this.prisma.playlist_songs.deleteMany({
      where: { playlist_id: +id },
    });

    await this.prisma.playlists.delete({
      where: { id: +id },
    });

    return { message: 'Playlist deleted successfully' };
  }
}
