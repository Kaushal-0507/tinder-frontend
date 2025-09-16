import React from "react";
import { DEFAULT_USER_IMG } from "../utils/constant";
import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";

const ConnectionReqCard = ({ user }) => {
  const isConnection = useSelector((store) => store.connections.isConnection);
  return (
    <div className="p-4 flex  bg-white/10 rounded-[5px] justify-between">
      <div className="flex gap-3">
        <img
          className="w-10 h-10 object-cover rounded-full border-2"
          src={user?.photos?.[0] || DEFAULT_USER_IMG}
          alt="User Img"
        />
        <div>
          <p className="font-semibold text-[14px]">
            {user?.firstName}, {user?.age || ""}
          </p>
          <p className="text-[12px]">{user?.about}</p>
        </div>
      </div>
      <div className="flex items-center">
        {isConnection ? (
          <p className="font-semibold h-9 pt-1 bg-emerald-700 hover:bg-emerald-600 cursor-pointer px-2 rounded-[5px] ">
            message
          </p>
        ) : (
          <div className="flex gap-2">
            <p className="rounded-full cursor-pointer  bg-gray-700 text-pink-600 w-10 h-10 flex hover:bg-gray-600 items-center justify-center">
              <FaTimes size={20} />
            </p>
            <p className="rounded-full cursor-pointer h-10  w-10 bg-gray-700 text-emerald-700 hover:bg-gray-600 flex items-center justify-center">
              <FaCheck size={20} />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionReqCard;
