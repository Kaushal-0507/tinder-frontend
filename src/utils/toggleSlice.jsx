import { createSlice } from "@reduxjs/toolkit";

const toggleSlice = createSlice({
  name: "toggle",
  initialState: {
    isDashboard: false,
  },
  reducers: {
    toggleDashboard: (state) => {
      state.isDashboard = !state.isDashboard;
    },
  },
});

export const { toggleDashboard } = toggleSlice.actions;
export default toggleSlice.reducer;
