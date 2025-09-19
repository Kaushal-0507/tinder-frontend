import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addUserFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import Dashboard from "./Dashboard";

const Feed = () => {
  const feed = useSelector((state) => state.feed);
  const user = useSelector((state) => state.user);
  const isDashboard = useSelector((state) => state.toggle.isDashboard);

  const dispatch = useDispatch();
  const getUserFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });

      dispatch(addUserFeed(res?.data));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getUserFeed();
  }, []);
  if (!feed) return;

  return (
    <div className="flex  relative">
      <div
        className={`${
          isDashboard
            ? "block bg-gray-800 absolute min-w-[40%] top-0 bottom-0 z-40"
            : "hidden"
        } lg:block lg:static border-r-1 w-1/3 border-white/10`}
      >
        <Dashboard user={user} />
      </div>

      {feed.length <= 0 ? (
        <div className="text-2xl text-emerald-700 font-bold m-auto">
          No New User
        </div>
      ) : (
        <div className="flex-1 ">{feed && <UserCard user={feed[0]} />}</div>
      )}
    </div>
  );
};

export default Feed;
