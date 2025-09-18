import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL, DEFAULT_USER_IMG } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addUserFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import Dashboard from "./Dashboard";

const Feed = () => {
  const feed = useSelector((state) => state.feed);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const getUserFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      console.log(res.data);
      dispatch(addUserFeed(res?.data));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserFeed();
  }, []);
  if (!feed) return;

  return (
    <div className="flex h-full">
      <Dashboard user={user} />
      {feed.length <= 0 ? (
        <div className="text-2xl  text-emerald-700 font-bold m-auto">
          No New User
        </div>
      ) : (
        <div className="flex-1"> {feed && <UserCard user={feed[0]} />} </div>
      )}
    </div>
  );
};

export default Feed;
