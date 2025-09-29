import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL, getMembershipGradient } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addUserFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import Dashboard from "./Dashboard";

const Feed = () => {
  const feed = useSelector((state) => state.feed);
  const loggedUser = useSelector((state) => state.user);
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
    <div className="flex relative min-h-[100dvh] overflow-hidden">
      {/* Dashboard Container */}
      <div
        className={`${
          isDashboard
            ? "block bg-gray-800 absolute w-full sm:w-3/4 md:w-2/3 lg:w-1/3 top-0 bottom-0 z-40"
            : "hidden"
        } lg:block lg:static border-r-1 lg:w-1/3 border-white/10 lg:h-screen lg:pt-16 pt-16`}
      >
        <Dashboard user={loggedUser} />
      </div>

      {feed.length <= 0 ? (
        <div
          className={`text-xl sm:text-2xl ${getMembershipGradient(
            loggedUser?.membershipType
          )} font-bold m-auto px-4 text-center`}
        >
          No New User
        </div>
      ) : (
        <div className="flex-1 sm:p-4 lg:pt-20 pt-18 flex justify-center items-center w-full">
          {feed && <UserCard user={feed[0]} flag={true} />}
        </div>
      )}
    </div>
  );
};

export default Feed;
