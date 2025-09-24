import React, { lazy, Suspense } from "react";
import { BASE_URL, DEFAULT_USER_IMG } from "../utils/constant";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUserFeed } from "../utils/feedSlice";
import { Link } from "react-router-dom";
const ImageCarousel = lazy(() => import("./ImageCarousel"));

const UserCard = ({ user }) => {
  if (!user) return;
  const { _id, firstName, lastName, age, about, hobbies, photos, gender } =
    user;

  const dispatch = useDispatch();
  const sendRequest = async (status, _id) => {
    const res = await axios.post(
      BASE_URL + "/request/send/" + status + "/" + _id,
      {},
      { withCredentials: true }
    );
    dispatch(removeUserFeed(_id));
  };
  return (
    <div className="w-full max-w-sm sm:max-w-md lg:w-88 h-[85vh] sm:h-[90vh] lg:max-h-[500px] lg:h-[95%] bg-gray-900 rounded-2xl overflow-hidden shadow-xl relative border border-gray-700 mx-auto ">
      {/* User Photo */}
      <div className="relative h-full lg:max-h-[500px] overflow-hidden mx-auto">
        {photos?.length > 0 ? (
          <Suspense fallback={<div>Loading gallery...</div>}>
            <ImageCarousel
              photos={photos}
              autoPlay={true}
              interval={4000} // 4 seconds between slides
              userId={_id}
            />
          </Suspense>
        ) : (
          <img
            className="w-full h-full object-cover"
            src={DEFAULT_USER_IMG}
            alt="default-user-img"
            loading="lazy"
          />
        )}
        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </div>

      {/* User Info */}
      <div className="absolute bottom-16 sm:bottom-20 left-4 sm:left-5 right-4 text-white">
        <h2 className="text-xl sm:text-2xl font-bold">
          {firstName}, <span className="font-normal">{age}</span>
        </h2>
        <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 mb-0.5">
          {about}
        </p>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {hobbies?.map((hobby) => (
            <span
              key={hobby}
              className="bg-white/10 text-gray-300 px-2 py-1 rounded-md text-[10px] sm:text-[11px] border border-gray-600"
            >
              {hobby}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex justify-between items-center px-4 sm:px-6">
        {/* Refresh Button */}
        <button className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gray-800 shadow-md flex items-center justify-center text-yellow-400 hover:bg-gray-700 transition-colors border border-gray-700">
          <svg
            className="w-5 sm:w-6 h-5 sm:h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" />
          </svg>
        </button>

        {/* Ignore (X) Button */}
        <button
          onClick={() => sendRequest("ignored", _id)}
          className="w-12 sm:w-14 h-12 sm:h-14 cursor-pointer rounded-full bg-gray-800 shadow-md flex items-center justify-center text-red-400 hover:bg-gray-700 transition-colors border border-gray-700"
        >
          <svg
            className="w-6 sm:w-7 h-6 sm:h-7"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
          </svg>
        </button>

        {/* Like (Heart) Button */}
        <button
          onClick={() => sendRequest("interested", _id)}
          className="w-12 sm:w-14 h-12 sm:h-14 cursor-pointer rounded-full bg-gray-800 shadow-md flex items-center justify-center text-pink-600 hover:bg-gray-700 transition-colors border border-gray-700"
        >
          <svg
            className="w-6 sm:w-7 h-6 sm:h-7"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
          </svg>
        </button>

        {/* More Options Button */}
        <Link to={`/user/profile/${_id}`}>
          <button className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gray-800 shadow-md flex items-center justify-center text-gray-400 hover:bg-gray-700 transition-colors border border-gray-700">
            <svg
              className="w-5 sm:w-6 h-5 sm:h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
