import { createSlice } from "@reduxjs/toolkit";
import { TypeGenre } from "../../types/typeGenre";
import { TypeSong } from "../../types/typeSong";

const initialState = {
  songLists: [],
  songGenre: [],
} as {
  songLists: TypeSong[];
  songGenre: TypeGenre[];
};

const songSlice = createSlice({
  name: "song",
  initialState,
  reducers: {
    setAllSongs: (state, { payload }) => {
      state.songLists = payload;
    },
    setAllGenre: (state, { payload }) => {
      state.songGenre = payload;
    },
  },
});

export const songAction = songSlice.actions;
export default songSlice;
