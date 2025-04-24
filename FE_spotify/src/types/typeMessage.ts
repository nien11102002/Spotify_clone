export interface TypeMessage {
  idSender: number;
  contentMess: string;
  timeSend: Date;
  roomChat: string;
}

export interface Sender {
  userId: number;
  account: string;
  name: string;
  nationality: string;
  chanelName: string;
  avatar: string;
  description: string;
  refreshToken: string;
  password: string;
  banner: string;
  role: string;
}
