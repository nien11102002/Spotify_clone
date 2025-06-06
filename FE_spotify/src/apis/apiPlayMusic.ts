import { ResponseApi } from "../types/typeResponseApi";
import { TypeSong } from "../types/typeSong";
import api from "./apiUtil";

export const apiPlayMusic = async (id: any) => {
  try {
    console.log("apiPlayMusic", id);
    const response = await api.get<ResponseApi<TypeSong>>(
      `/song/play-music/${id}`
    );
    return response.data.content;
  } catch (error: any) {
    throw new Error(error);
  }
};
