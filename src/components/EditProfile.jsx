import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";
import { uploadToCloudinary } from "../utils/cloudinaryUpload"; // Import the Cloudinary upload function
import { BASE_URL } from "../utils/constant";
import { Link } from "react-router-dom";

const EditProfile = () => {
  const userData = useSelector((store) => store.user);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null); // Track which image is uploading
  const dispatch = useDispatch();

  // Get existing photos from Redux store or empty array
  const existingPhotos = userData?.photos || [];

  // Create array of exactly 5 photos, filling with existing photos first, then null
  const initialPhotos = Array(5)
    .fill(null)
    .map((_, index) => existingPhotos[index] || null);

  const [profile, setProfile] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    age: userData?.age || "",
    gender: userData?.gender || "",
    about: userData?.about || "",
    hobbies: userData?.hobbies || [],
  });

  // Use the initialPhotos array that combines existing photos with empty slots
  const [photos, setPhotos] = useState(initialPhotos);
  const [hobbiesInput, setHobbiesInput] = useState(
    userData?.hobbies?.join(", ") || ""
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHobbiesChange = (e) => {
    const value = e.target.value;
    setHobbiesInput(value);
    const hobbiesArray = value
      .split(",")
      .map((hobby) => hobby.trim())
      .filter((hobby) => hobby !== "");
    setProfile((prev) => ({
      ...prev,
      hobbies: hobbiesArray,
    }));
  };

  const handlePhotoUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 10MB - Cloudinary can handle but good to limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image is too large. Please select an image under 10MB.");
      return;
    }

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, etc.)");
      return;
    }

    setUploadingIndex(index);
    setError("");

    try {
      // Upload to Cloudinary with signed approach
      const cloudinaryUrl = await uploadToCloudinary(file);

      // Update photos state with Cloudinary URL
      const newPhotos = [...photos];
      newPhotos[index] = cloudinaryUrl;
      setPhotos(newPhotos);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(error.message || "Failed to upload image. Please try again.");
    } finally {
      setUploadingIndex(null);
    }
  };

  // Function to remove a photo
  const handleRemovePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Prepare data for backend - filter out null photos
      const nonNullPhotos = photos.filter((photo) => photo !== null);
      const requestData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        age: profile.age ? parseInt(profile.age) : undefined,
        gender: profile.gender,
        about: profile.about,
        hobbies: profile.hobbies,
        photos: nonNullPhotos,
      };

      // Remove empty fields
      Object.keys(requestData).forEach((key) => {
        if (
          requestData[key] === "" ||
          requestData[key] === null ||
          requestData[key] === undefined ||
          (Array.isArray(requestData[key]) && requestData[key].length === 0)
        ) {
          delete requestData[key];
        }
      });

      const response = await axios.patch(
        BASE_URL + "/profile/edit",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast("Profile updated successfully", {
        type: "success",
      });
      dispatch(addUser(response.data?.data));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast(error?.response?.data?.message || "Error updating profile", {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-3 sm:p-6 flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-2/3 xl:w-3/5">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Edit Profile
        </h1>

        {error && (
          <div className="bg-red-800 text-white p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Photo Upload Section with updated size warning */}
          <div>
            <p className="text-xs sm:text-sm text-gray-400 mb-2">
              Max 10MB per image
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-5">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <label
                    htmlFor={`photo-upload-${index}`}
                    className="block cursor-pointer"
                  >
                    <div className="w-full h-46 sm:h-40 bg-gray-800 rounded-lg flex items-center justify-center border border-dashed border-gray-600 hover:border-gray-400 transition-colors relative">
                      {uploadingIndex === index ? (
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-1 sm:mb-2"></div>
                          <span className="text-[10px] sm:text-xs">
                            Uploading...
                          </span>
                        </div>
                      ) : photo ? (
                        <>
                          <img
                            src={photo}
                            alt={`Profile ${index + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          {/* Remove button overlay */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemovePhoto(index);
                            }}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <svg
                          className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      )}
                    </div>
                  </label>
                  <input
                    id={`photo-upload-${index}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(index, e)}
                    disabled={uploadingIndex !== null}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Rest of your form remains the same */}
          {/* Basic Information Section */}
          <div className="bg-gray-800 p-4 sm:p-5 rounded-lg">
            <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  placeholder="Your first name"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  placeholder="Your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                  placeholder="Your age"
                  min="18"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-gray-800 p-4 sm:p-5 rounded-lg">
            <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
              About Me
            </h2>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                name="about"
                value={profile.about}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                placeholder="Tell others about yourself"
              />
            </div>
          </div>

          {/* Interests Section */}
          <div className="bg-gray-800 p-4 sm:p-5 rounded-lg">
            <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
              Interests & Hobbies
            </h2>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                Hobbies
              </label>
              <textarea
                name="hobbies"
                value={hobbiesInput}
                onChange={handleHobbiesChange}
                rows={2}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                placeholder="e.g. hiking, photography, cooking"
              />
              <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                Separate hobbies with commas
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
            <button
              type="submit"
              disabled={isLoading || uploadingIndex !== null}
              className="bg-gradient-to-r cursor-pointer from-emerald-600  to-blue-600  text-white font-medium py-2 px-4 sm:px-6 rounded-full hover:from-emerald-500  hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <Link to="/" className="w-full sm:w-auto">
              {!isLoading && userData?.age && (
                <button
                  type="button"
                  disabled={isLoading || uploadingIndex !== null}
                  className="w-full sm:w-auto bg-gradient-to-r cursor-pointer from-emerald-600 to-blue-600 text-white font-medium py-2 px-4 sm:px-6 rounded-full hover:from-emerald-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Home
                </button>
              )}
            </Link>
          </div>
        </form>
      </div>
      <div className="w-full lg:w-1/3 xl:w-2/5 flex justify-center lg:justify-center">
        <div className="w-full max-w-sm">
          <UserCard user={userData} />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
