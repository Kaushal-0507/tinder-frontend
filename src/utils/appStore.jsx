import { configureStore } from "@reduxjs/toolkit";
import feedReducer from "./feedSlice";
import userReducer from "./userSlice";
import connectionReducer from "./connectionSlice";
import requestReducer from "./requestSlice";
import toggleReducer from "./toggleSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionReducer,
    requests: requestReducer,
    toggle: toggleReducer,
  },
});

export default appStore;
