import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";

const UserSettings = () => {
  const [activePopup, setActivePopup] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white lg:pt-20 pt-22 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-700 to-blue-700 bg-clip-text text-transparent mb-3">
            Account Settings
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your account preferences and security
          </p>
        </div>

        {/* Premium Plan Notice - New Addition */}
        <div className="mb-8 bg-gradient-to-r from-emerald-900/50  to-blue-900/30 border border-emerald-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 group relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/5 group-hover:from-emerald-500/20 group-hover:to-blue-500/10 transition-all duration-500"></div>

          <div className="relative z-10 flex items-center space-x-4">
            <div className="p-3 bg-white/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-white">
                  Premium Plan Available!
                </h3>
                <span className="px-2 py-1 bg-emerald-500/20 text-blue-300 text-xs font-medium rounded-full border border-emerald-500/30">
                  NEW
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                Unlock exclusive features: Unlimited connections, advanced user
                profile features, and priority support.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/premium">
                  <button className="px-4 py-2 bg-gradient-to-r from-emerald-600/60 to-blue-600/30 hover:from-emerald-700 hover:to-blue-700/70 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 transform shadow-lg shadow-purple-600/20">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Delete Account Card */}
          <div className="bg-gray-800 border border-red-900/50 rounded-2xl p-6 hover:border-red-600/30 transition-all duration-300 hover:transform hover:scale-105 group">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-red-900/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Delete My Account
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
              </div>
            </div>
            <button
              className="w-full mt-6 px-6 py-3 bg-red-600/50 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 transform shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setActivePopup("delete")}
              disabled={loading}
            >
              {loading ? "Processing..." : "Delete Account"}
            </button>
          </div>

          {/* Change Password Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105 group">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-900/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🔒</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Change Password
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Update your password to keep your account secure. Use a
                  strong, unique password.
                </p>
              </div>
            </div>
            <button
              className="w-full mt-6 px-6 py-3 bg-blue-600/50 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 transform shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setActivePopup("changePassword")}
              disabled={loading}
            >
              {loading ? "Processing..." : "Change Password"}
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Need help? Contact our support team for assistance.
          </p>
        </div>
      </div>

      {/* Popup Render */}
      {activePopup && (
        <Popup
          type={activePopup}
          onClose={() => setActivePopup(null)}
          setLoading={setLoading}
          loading={loading}
        />
      )}
    </div>
  );
};

// Separate Popup component to prevent re-renders
const Popup = ({ type, onClose, setLoading, loading }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const popups = {
    delete: {
      title: "Delete Account",
      description:
        "This action cannot be undone. Please enter your current password to confirm account deletion.",
      fields: ["oldPassword"],
    },
    changePassword: {
      title: "Change Password",
      description:
        "Enter your current password and new password to update your security settings.",
      fields: ["oldPassword", "newPassword"],
    },
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.oldPassword) {
      toast("Please enter your current password", { type: "error" });
      return;
    }

    if (type === "changePassword" && !formData.newPassword) {
      toast("Please enter a new password", { type: "error" });

      return;
    }

    setLoading(true);

    try {
      if (type === "delete") {
        // Delete account API call
        const response = await axios.delete(BASE_URL + "/profile/user/delete", {
          data: {
            oldPassword: formData.oldPassword,
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          toast("Account deleted successfully", { type: "success" });
          // Redirect to login or home page after successful deletion

          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } else if (type === "changePassword") {
        // Change password API call
        const response = await axios.patch(
          BASE_URL + "/profile/password",
          {
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          toast("Password changed successfully", {
            type: "success",
          });
          onClose();
        }
      }
    } catch (error) {
      console.error(`${type} error:`, error);

      let errorMessage = "An error occurred. Please try again.";

      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data || errorMessage;
      } else if (error.request) {
        // Request made but no response received
        errorMessage = "Network error. Please check your connection.";
      }

      toast(errorMessage, { type: "error" });
    } finally {
      setLoading(false);
      setFormData({ oldPassword: "", newPassword: "" });
    }
  };

  const config = popups[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">{config.title}</h3>
          <button
            className="text-gray-400 hover:text-white text-2xl font-light transition-colors duration-200 disabled:opacity-50"
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <p className="text-gray-300 mb-6 text-sm leading-relaxed">
          {config.description}
        </p>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Current Password
            </label>
            <input
              type="text"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleInputChange}
              placeholder="Enter your current password"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
              autoFocus
              disabled={loading}
            />
          </div>

          {type === "changePassword" && (
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                New Password
              </label>
              <input
                type="text"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter your new password"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
                disabled={loading}
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 font-medium hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={`flex-1 px-4 py-3 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed ${
              type === "delete"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : type === "delete"
              ? "Delete Account"
              : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
