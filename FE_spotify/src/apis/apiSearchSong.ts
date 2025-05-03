import { ResponseApi } from "../types/typeResponseApi";
import { TypeSongResponse } from "../types/typeSong";
import api from "./apiUtil";

export const apiSearchSong = async (
  data: string,
  page: number = 1,
  pageSize: number = 10
) => {
  try {
    const response = await api.get<ResponseApi<TypeSongResponse>>(
      `/song/search-song/${data}?page=${page}&pageSize=${pageSize}`
    );
    return response.data.content;
  } catch (error: any) {
    console.error("Failed to fetch songs", error);
  }
};
