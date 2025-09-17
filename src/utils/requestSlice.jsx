import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    addUserRequest: (state, action) => action.payload,
    removeUserRequest: (state, action) => {
      const newArray = state.filter((r) => r._id !== action.payload);
      return newArray;
    },
  },
});

export const { addUserRequest, removeUserRequest } = requestSlice.actions;
export default requestSlice.reducer;
