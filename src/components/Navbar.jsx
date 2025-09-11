import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  return (
    <>
      <div className="navbar bg-base-200 shadow-sm px-4">
        <div className="flex-1">
          {/* <a className="text-xl font-semibold text-gray-300">
            meet<span className="text-emerald-700 font-bold">Devs</span>
            
          </a> */}
          <Link
            to="/feed"
            className="text-2xl font-bold text-emerald-700 cursor-pointer"
          >
            stumble.
          </Link>
        </div>
        {user && (
          <div className="flex gap-2">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full border-2">
                  <img alt="User profile" src={user?.photoUrl} />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-52 p-2 shadow cursor-pointer"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                  </Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
