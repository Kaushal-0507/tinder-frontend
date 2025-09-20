import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import { BASE_URL, DEFAULT_USER_IMG } from "../utils/constant";
import { toast } from "react-toastify";
import { removeUserFeed } from "../utils/feedSlice";
import { FaAngleDoubleLeft } from "react-icons/fa";
import { toggleDashboard } from "../utils/toggleSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <>
      <div className="navbar bg-base-200 shadow-sm px-2 sm:px-4">
        <div className="flex-1">
          {/* <a className="text-xl font-semibold text-gray-300">
            meet<span className="text-emerald-700 font-bold">Devs</span>
            
          </a> */}
          <Link
            to="/"
            className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-700 cursor-pointer"
          >
            stumble.
          </Link>
        </div>
        {user && (
          <div className="flex gap-1 sm:gap-2 items-center">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-8 sm:w-10 rounded-full border-2">
                  <img
                    alt="User profile"
                    src={
                      user?.photos.length > 0
                        ? user.photos[0]
                        : DEFAULT_USER_IMG
                    }
                    loading="lazy"
                  />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-300 rounded-box z-50 mt-3 w-48 sm:w-52 p-2 shadow cursor-pointer"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                  </Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li onClick={handleLogout}>
                  <a>Logout </a>
                </li>
              </ul>
            </div>

            <div
              className="m-auto lg:hidden block p-2 hover:bg-base-300 rounded-full cursor-pointer"
              onClick={() => dispatch(toggleDashboard())}
            >
              <FaAngleDoubleLeft size={18} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
