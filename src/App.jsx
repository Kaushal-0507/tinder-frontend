import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Body from "./components/Body";
import Profile from "./components/Profile";
import { Provider, useSelector } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import UserProfile from "./components/UserProfile";
import UserSettings from "./components/UserSettings";
import PremiumPlan from "./components/PremiumPlan";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user/profile/:userId" element={<UserProfile />} />
            <Route path="/profile/userSetting" element={<UserSettings />} />
            <Route path="/premium" element={<PremiumPlan />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
