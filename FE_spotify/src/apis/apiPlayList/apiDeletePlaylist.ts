import api from "./../apiUtil";
import { playlistAction } from "../../redux/slice/playlist.slice";
import { AppDispatch } from "./../../redux/store";

export const deletePlaylist = (data: any) => async (dispatch: AppDispatch) => {
  try {
    const response = await api.delete(`/playlist/remove-playlist/${data}`);
    dispatch(playlistAction.getPlaylistDetailById(response.data.content));
    return response.data;
  } catch (error) {
    console.error("Error creating playlist:", error);
    return undefined;
  }
};
