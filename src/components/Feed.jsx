import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL, DEFAULT_USER_IMG } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addUserFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import Dashboard from "./Dashboard";

const Feed = () => {
  const { feed, user } = useSelector((store) => store);
  const dispatch = useDispatch();
  const getUserFeed = async () => {
    try {
      if (feed) return;
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addUserFeed(res?.data));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserFeed();
  }, []);
  return (
    <div className="flex ">
      <Dashboard user={user} />
      <div className="flex-1"> {feed && <UserCard user={feed[1]} />} </div>
    </div>
  );
};

export default Feed;
