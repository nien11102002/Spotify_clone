import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @MessagePattern('all-songs')
  async getAllSongs() {
    const songs = await this.prisma.songs.findMany({
      include: {
        song_genres: true,
      },
    });

    const formattedSongs = songs.map((song) => {
      return {
        songId: song.id,
        userId: song.user_id,
        genreId: song.song_genres.id,
        genreName: song.song_genres.genre_name,
        songName: song.song_name,
        viewer: song.viewer,
        duration: song.duration,
        popular: song.popular,
        description: song.description,
        songImage: song.song_image,
        publicDate: song.public_date,
        filePath: song.file_path,
        discussQuality: song.discuss_quality,
      };
    });

    return formattedSongs;
  }

  @MessagePattern('all-genres')
  async getAllGenres() {
    const genres = await this.prisma.song_genres.findMany({
      include: {
        songs: true,
      },
    });

    const formattedGenres = genres.map((genre) => {
      return {
        genreId: genre.id,
        genreName: genre.genre_name,
      };
    });

    return formattedGenres;
  }

  @MessagePattern('find-song')
  async findSongById(@Payload() data) {
    const id = +data.id;
    const song = await this.prisma.songs.findUnique({
      where: {
        id: id,
      },
      include: {
        song_genres: true,
      },
    });

    if (!song) {
      throw new RpcException({
        statusCode: 404,
        message: 'Song not found',
      });
    }

    const formattedSong = {
      songId: song.id,
      userId: song.user_id,
      genreId: song.song_genres.id,
      genreName: song.song_genres.genre_name,
      songName: song.song_name,
      viewer: song.viewer,
      duration: song.duration,
      popular: song.popular,
      description: song.description,
      songImage: song.song_image,
      publicDate: song.public_date,
      filePath: song.file_path,
      discussQuality: song.discuss_quality,
    };

    return formattedSong;
  }

  @MessagePattern('play-music')
  async playMusic(@Payload() data) {
    const id = +data.id;
    const song = await this.prisma.songs.findUnique({
      where: {
        id: id,
      },
      include: {
        song_genres: true,
      },
    });

    if (!song) {
      throw new RpcException({
        statusCode: 404,
        message: 'Song not found',
      });
    }

    const formattedSong = {
      songId: song.id,
      userId: song.user_id,
      genreId: song.song_genres.id,
      genreName: song.song_genres.genre_name,
      songName: song.song_name,
      viewer: song.viewer,
      duration: song.duration,
      popular: song.popular,
      description: song.description,
      songImage: song.song_image,
      publicDate: song.public_date,
      filePath: song.file_path,
      discussQuality: song.discuss_quality,
    };

    return formattedSong;
  }
}
