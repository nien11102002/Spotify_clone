export class CreatePlayListDto {
  userId: number;
  imagePath: string;
  playlistName: string;
  description: string;
  createDate?: Date;
}
