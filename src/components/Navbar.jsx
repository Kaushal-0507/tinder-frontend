import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import {
  BASE_URL,
  DEFAULT_USER_IMG,
  getMembershipBorder,
  getMembershipGradient,
} from "../utils/constant";
import { toast } from "react-toastify";
import { removeUserFeed } from "../utils/feedSlice";
import { FaAngleDoubleLeft } from "react-icons/fa";
import { toggleDashboard } from "../utils/toggleSlice";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const isFeed = location.pathname === "/";

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/logout",
        {},
        { withCredentials: true }
      );
      dispatch(removeUser());
      dispatch(removeUserFeed());
      toast(res?.data, { type: "success" });
      navigate("/login");
    } catch (error) {
      console.error(error.message);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const goToHome = () => {
    if (user) {
      navigate("/");
    } else {
      navigate("/landingPage");
    }
  };

  return (
    <>
      <div className="navbar absolute top-0 z-50 bg-base-200 shadow-sm px-2 sm:px-4">
        <div
          onClick={goToHome}
          className={`flex-1 text-lg sm:text-xl md:text-2xl text-emerald-600 font-bold cursor-pointer`}
        >
          stumble.
        </div>
        {user && (
          <div className="flex gap-1 sm:gap-2 items-center">
            {user?.membershipType && (
              <div>
                <span
                  className={`${getMembershipGradient(
                    user.membershipType
                  )} px-4 py-1.5 rounded-[10px] text-[16px] font-bold `}
                >
                  {user.membershipType?.toUpperCase()}
                </span>
              </div>
            )}

            {/* Custom Dropdown */}
            <div className="dropdown-container relative">
              {/* Profile Button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="btn btn-ghost btn-circle avatar p-0 hover:bg-transparent focus:bg-transparent"
              >
                <div
                  className={`w-8 sm:w-10 rounded-full border-2 ${getMembershipBorder(
                    user.membershipType
                  )}`}
                >
                  <img
                    alt="User profile"
                    src={
                      user?.photos?.length > 0
                        ? user.photos[0]
                        : DEFAULT_USER_IMG
                    }
                    loading="lazy"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className={`absolute right-0 mt-3 w-48 sm:w-48 bg-base-300 rounded-box shadow-lg z-50`}
                >
                  <ul className="py-1.5 cursor-pointer">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-1 hover:bg-base-200 transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="flex justify-between items-center">
                          Profile
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile/userSetting"
                        className="block px-4 py-1 hover:bg-base-200 transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/premium"
                        className="block px-4 py-1 hover:bg-base-200 transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Premium
                      </Link>
                    </li>
                    <li className="border-t border-base-100 mt-2 pt-2">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-1 hover:bg-base-200 transition-colors duration-200 text-error"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {isFeed && (
              <div
                className="m-auto lg:hidden block p-2 hover:bg-base-300 rounded-full cursor-pointer"
                onClick={() => dispatch(toggleDashboard())}
              >
                <FaAngleDoubleLeft size={18} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
