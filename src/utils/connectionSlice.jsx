import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connections",
  initialState: {
    connections: [],
    isConnection: true,
  },
  reducers: {
    addConnections: (state, action) => {
      // Correctly update state without replacing it entirely
      state.connections = action.payload;
    },
    removeConnections: (state) => {
      state.connections = [];
    },
    showConnection: (state, action) => {
      state.isConnection = action.payload;
    },
  },
});

export const { addConnections, removeConnections, showConnection } =
  connectionSlice.actions;
export default connectionSlice.reducer;
