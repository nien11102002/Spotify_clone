export interface TypeComment {
  userId: number;
  discussId: number;
  content: string;
  songId: number;
  discussDate: Date;
  replyDiscussId: null | string;
  User: TypeUser;
}

export type TypeUser = {
  userId: number;
  name: string;
  nationality: string;
  channelName: string;
  avatar: string;
  description: null | string;
  banner: string;
  role: Role;
};
export enum Role {
  Admin = 'admin',
  Singer = 'singer',
  User = 'user',
}
