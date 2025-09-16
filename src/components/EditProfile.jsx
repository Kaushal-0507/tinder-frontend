import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";

const EditProfile = () => {
  const userData = useSelector((store) => store.user);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  // Compress image function
  const compressImage = (base64Image, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Image;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };
    });
  };

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
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image is too large. Please select an image under 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // Compress the image
          const compressedImage = await compressImage(e.target.result);
          const newPhotos = [...photos];
          newPhotos[index] = compressedImage;
          setPhotos(newPhotos);
        } catch (error) {
          console.error("Error compressing image:", error);
          setError("Failed to process image");
        }
      };
      reader.readAsDataURL(file);
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
        `${BASE_URL}/profile/edit`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Profile updated successfully:", response.data);
      toast("Profile updated successfully", {
        type: "success",
      });
      dispatch(addUser(response.data?.data));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast(error?.response?.data, {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-6 flex">
      <div className="w-2xl mx-8">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

        {error && (
          <div className="bg-red-800 text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload Section with size warning */}
          <div>
            <p className="text-sm text-gray-400 mb-2">Max 2MB per image</p>
            <div className="grid grid-cols-3 gap-4 md:grid-cols-5">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <label
                    htmlFor={`photo-upload-${index}`}
                    className="block cursor-pointer"
                  >
                    <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center border border-dashed border-gray-600 hover:border-gray-400 transition-colors relative">
                      {photo ? (
                        <>
                          <img
                            src={photo}
                            alt={`Profile ${index + 1}`}
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
                              className="w-4 h-4"
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
                          className="w-8 h-8 text-gray-500"
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
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Rest of your form remains the same */}
          {/* Basic Information Section */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <h2 className="text-lg font-medium mb-4">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your first name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your age"
                  min="18"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          <div className="bg-gray-800 p-5 rounded-lg">
            <h2 className="text-lg font-medium mb-4">About Me</h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                name="about"
                value={profile.about}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Tell others about yourself"
              />
            </div>
          </div>

          {/* Interests Section */}
          <div className="bg-gray-800 p-5 rounded-lg">
            <h2 className="text-lg font-medium mb-4">Interests & Hobbies</h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Hobbies
              </label>
              <textarea
                name="hobbies"
                value={hobbiesInput}
                onChange={handleHobbiesChange}
                rows={2}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. hiking, photography, cooking"
              />
              <p className="text-xs text-gray-400 mt-1">
                Separate hobbies with commas
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r cursor-pointer from-purple-600 to-pink-600 text-white font-medium py-2 px-6 rounded-full hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <div className="mx-auto my-18">
        <UserCard user={userData} />
      </div>
    </div>
  );
};

export default EditProfile;
