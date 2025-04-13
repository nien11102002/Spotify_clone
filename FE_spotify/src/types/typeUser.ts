export type TypeUser = {
  userId: number;
  account: string;
  name: string;
  nationality: string;
  channelName: string;
  avatar: string;
  description: null | string;
  refreshToken: string;
  banner: string;
  role: Role;
};
export enum Role {
  Admin = "admin",
  Singer = "singer",
  User = "user",
}
