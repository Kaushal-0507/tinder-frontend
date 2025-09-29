import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isPwdVisible, setIsPwdVisible] = useState(false);

  const toggleLoginPage = () => {
    setIsLogin(!isLogin);
  };

  const togglePassword = () => {
    setIsPwdVisible(!isPwdVisible);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const url = isLogin ? BASE_URL + "/login" : BASE_URL + "/signup";
      const data = isLogin
        ? {
            email,
            password,
          }
        : {
            firstName,
            lastName,
            email,
            password,
          };

      const res = await axios.post(url, data, { withCredentials: true });

      dispatch(addUser(res.data));
      const message = isLogin
        ? "Login Successful!!!"
        : "Sign Up Successful!!! ";
      toast(message, { type: "success" });
      isLogin ? navigate("/") : navigate("/profile");
    } catch (error) {
      toast(error?.response?.data, { type: "error" });
      console.error(error);
    }
  };
  return (
    <div
      className={`flex justify-center p-3 sm:p-5 items-center min-h-[100dvh] ${
        isLogin ? "pt-4" : "pt-20"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/80 backdrop-blur-sm p-6 sm:p-8 rounded-lg w-full max-w-sm sm:max-w-md shadow-xl border border-gray-700"
      >
        <h2 className="text-gray-100 text-center mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold">
          {isLogin ? "Welcome Back" : "Welcome"}
        </h2>

        {!isLogin && (
          <>
            <div className="mb-4 sm:mb-5">
              <label className="block text-gray-400 mb-2 text-sm font-medium">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-800/70 border border-gray-600 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-sm sm:text-base"
                placeholder="Enter your first name"
              />
            </div>
            <div className="mb-4 sm:mb-5">
              <label className="block text-gray-400 mb-2 text-sm font-medium">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-800/70 border border-gray-600 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-sm sm:text-base"
                placeholder="Enter your last name"
              />
            </div>
          </>
        )}

        <div className="mb-4 sm:mb-5">
          <label className="block text-gray-400 mb-2 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded bg-gray-800/70 border border-gray-600 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-sm sm:text-base"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4 sm:mb-6 relative">
          <label className="block text-gray-400 mb-2 text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              type={isPwdVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 rounded bg-gray-800/70 border border-gray-600 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-sm sm:text-base"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {isPwdVisible ? (
                <LuEyeClosed color="gray" size={20} />
              ) : (
                <LuEye color="gray" size={20} />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 sm:py-3 px-4 rounded font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-sm sm:text-base"
          onClick={handleSubmit}
        >
          {isLogin ? "Sign In" : "Sign Up"}
        </button>
        <div className="flex justify-between items-center my-3 sm:my-4 gap-2">
          <p className="text-gray-400 font-semibold text-xs sm:text-sm">
            {isLogin ? "Don't have an account!" : "Already account exist!"}
          </p>

          <p
            onClick={toggleLoginPage}
            className="font-extrabold text-emerald-700 cursor-pointer underline text-xs sm:text-sm"
          >
            {isLogin ? "Sign Up" : "Login"}
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
