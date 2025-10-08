import React, { useEffect, useState } from "react";
import { BASE_URL, DEFAULT_USER_IMG } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import axios from "axios";
import { removeUserRequest } from "../utils/requestSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  chatUserData,
  toggleChatBox,
  toggleDashboard,
} from "../utils/toggleSlice";
import { createSocketConnection } from "../utils/socket";

const ConnectionReqCard = ({ user, id }) => {
  const [isOnline, setIsOnline] = useState(false);
  const isConnection = useSelector((store) => store.connections.isConnection);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?._id) return;

    const socket = createSocketConnection();

    // Check if this user is online
    socket.emit("checkUserOnline", user._id);
    socket.on("userOnlineStatus", (data) => {
      if (data.userId === user._id) {
        setIsOnline(data.isOnline);
      }
    });

    // Listen for status changes
    socket.on("userStatusChanged", (data) => {
      if (data.userId === user._id) {
        setIsOnline(data.isOnline);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  const handleMessageClick = () => {
    dispatch(chatUserData(user));
    dispatch(toggleChatBox(true));
    dispatch(toggleDashboard(false));
  };

  const reviewRequests = async (status, _id) => {
    const res = await axios.post(
      BASE_URL + "/request/review/" + status + "/" + _id,
      {},
      { withCredentials: true }
    );
    dispatch(removeUserRequest(_id));
  };

  return (
    <div className="p-3 sm:p-4 flex bg-white/10 rounded-[5px] justify-between mb-2">
      <div>
        <Link to={`/user/profile/${user?._id}`}>
          <div className="flex gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="relative">
              <img
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 object-cover flex-shrink-0"
                src={user?.photos?.[0] || DEFAULT_USER_IMG}
                alt="User Img"
                loading="lazy"
              />
              {/* Online status indicator */}
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
                  isOnline ? "bg-green-400" : "bg-gray-400"
                }`}
              ></div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-xs sm:text-[14px] truncate">
                {user?.firstName}, {user?.age || ""}
              </p>
              <p className="text-[11px] sm:text-[12px] line-clamp-1">
                {user?.about}
              </p>
            </div>
          </div>
        </Link>
      </div>
      <div className="flex items-center ml-2">
        {isConnection ? (
          <p
            onClick={handleMessageClick}
            className="font-semibold h-8 sm:h-9 bg-emerald-700 hover:bg-emerald-600 cursor-pointer px-2 sm:px-3 rounded-[5px] text-xs sm:text-sm flex items-center justify-center"
          >
            message
          </p>
        ) : (
          <div className="flex gap-1 sm:gap-2">
            <p
              onClick={() => reviewRequests("rejected", id)}
              className="rounded-full cursor-pointer bg-gray-700 text-pink-600 w-8 h-8 sm:w-10 sm:h-10 flex hover:bg-gray-600 items-center justify-center"
            >
              <FaTimes size={16} className="sm:w-5 sm:h-5" />
            </p>
            <p
              onClick={() => reviewRequests("accepted", id)}
              className="rounded-full cursor-pointer h-8 w-8 sm:h-10 sm:w-10 bg-gray-700 text-emerald-700 hover:bg-gray-600 flex items-center justify-center"
            >
              <FaCheck size={16} className="sm:w-5 sm:h-5" />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionReqCard;
