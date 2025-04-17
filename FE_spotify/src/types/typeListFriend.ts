export interface TypeListFriend {
  id: number;
  userId: number;
  friendId: number;
  roomChat: string;
  User_ListFriends_friendIdToUser: IsFriend;
}

export interface IsFriend {
  userId: number;
  name: string;
  nationality: string;
  chanelName: string;
  avatar: string;
  description: string;
  banner: string;
  role: string;
}
