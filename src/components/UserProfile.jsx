import React, { useEffect, useState } from "react";
import { BASE_URL, DEFAULT_USER_IMG } from "../utils/constant";
import ImageCarousel from "./ImageCarousel";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCheck, FaTimes } from "react-icons/fa";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const { userId } = useParams();

  const getOthersProfile = async (userId) => {
    const user = await axios.get(BASE_URL + "/user/profile/" + userId, {
      withCredentials: true,
    });
    setUserDetails(user?.data);
  };

  useEffect(() => {
    getOthersProfile(userId);
  }, [userId]);

  if (!userDetails) return;

  const { firstName, lastName, age, about, hobbies, photos, gender } =
    userDetails;

  // Filter out null photos
  const validPhotos = photos?.filter((photo) => photo !== null) || [];

  return (
    <div className="flex flex-col lg:flex-row px-10 py-4 gap-4">
      {/* Left Side - Image Carousel */}

      <div className="min-w-[320px] h-[500px] rounded-xl overflow-hidden shadow-lg">
        {validPhotos.length > 0 ? (
          <ImageCarousel photos={validPhotos} autoPlay={true} interval={4000} />
        ) : (
          <div className="w-full h-96 flex items-center justify-center bg-gray-800">
            <img
              className="w-full h-full object-cover"
              src={DEFAULT_USER_IMG}
              alt="default-user"
            />
          </div>
        )}
      </div>

      {/* Right Side - User Details */}

      <div className="space-y-6 w-full">
        {/* Header Section */}
        <div className="border-b border-gray-700 pb-6">
          <h1 className="text-3xl font-bold text-white">
            {firstName} {lastName}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xl text-gray-300">{age} years</span>
            <span className="text-sm bg-purple-600 px-3 py-1 rounded-full capitalize">
              {gender || "Not specified"}
            </span>
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <svg
              className="w-5 h-5 text-purple-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            About
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {about || "No bio available yet."}
          </p>
        </div>

        {/* Hobbies Section */}
        {hobbies && hobbies.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <svg
                className="w-5 h-5 text-purple-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Interests & Hobbies
            </h2>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby, index) => (
                <span
                  key={index}
                  className="bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm border border-gray-600 hover:bg-gray-600 transition-colors"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">
              {validPhotos.length}
            </div>
            <div className="text-sm text-gray-400">Photos</div>
          </div>
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">
              {hobbies?.length || 0}
            </div>
            <div className="text-sm text-gray-400">Interests</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
