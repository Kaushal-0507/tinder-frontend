import { createSlice } from "@reduxjs/toolkit";

const toggleSlice = createSlice({
  name: "toggle",
  initialState: {
    isDashboard: false,
    isChatBox: false,
    chatUser: null,
  },
  reducers: {
    toggleDashboard: (state) => {
      state.isDashboard = !state.isDashboard;
    },
    toggleChatBox: (state, action) => {
      state.isChatBox = action.payload;
    },
    chatUserData: (state, action) => {
      state.chatUser = action.payload;
    },
  },
});

export const { toggleDashboard, toggleChatBox, chatUserData } =
  toggleSlice.actions;
export default toggleSlice.reducer;
