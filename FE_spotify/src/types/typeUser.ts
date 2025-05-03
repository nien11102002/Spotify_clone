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
  Admin = "admin",
  Singer = "artist",
  User = "user",
}
