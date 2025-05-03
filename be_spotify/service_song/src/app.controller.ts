import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Controller()
export class AppController {
  constructor(
    private prisma: PrismaService,
    private elasticService: ElasticsearchService,
  ) {}

  @MessagePattern('search-song')
  async searchSong(@Payload() data) {
    const searchTerm = data.searchTerm;
    const songs = await this.elasticService.search<any>({
      index: 'song-spotify-index',
      query: {
        match: {
          song_name: searchTerm,
        },
      },
    });

    const formattedSongs = songs.hits.hits.map((song) => {
      return {
        songId: song._source.song_id,
        userId: song._source.user_id,
        genreId: song._source.id,
        genreName: song._source.genre_name,
        songName: song._source.song_name,
        viewer: song._source.viewer,
        duration: song._source.duration,
        popular: song._source.popular,
        description: song._source.description,
        songImage: song._source.song_image,
        publicDate: song._source.public_date,
        filePath: song._source.file_path,
        discussQuality: song._source.discuss_quality,
      };
    });

    return formattedSongs;
  }

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
        nameGenre: genre.genre_name,
        createTime: genre.created_at,
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
