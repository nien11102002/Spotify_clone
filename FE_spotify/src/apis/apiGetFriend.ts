import { TypeListFriend } from "../types/typeListFriend";
import { ResponseApi } from "../types/typeResponseApi";
import api from "./apiUtil";

export const apiGetFriend = async (id: any) => {
  try {
    const response = await api.get<ResponseApi<TypeListFriend[]>>(
      `/friend/get-list-friend/${id}`
    );
    console.log("response", response);
    return response.data.content;
  } catch (error) {}
};
