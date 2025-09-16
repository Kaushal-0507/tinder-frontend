import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    addUserRequest: (state, action) => action.payload,
    removeUserRequest: () => null,
  },
});

export const { addUserRequest, removeUserRequest } = requestSlice.actions;
export default requestSlice.reducer;
