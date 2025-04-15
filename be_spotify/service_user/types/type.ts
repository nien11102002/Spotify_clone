export type TUser = {
  id: number;
  account: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
};

export type TUserAccount = { id?: number; password?: string };
