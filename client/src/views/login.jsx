import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { EyeClosed, EyeIcon } from "lucide-react";
import { AxiosInstance } from "../Utils/AxiosInstance";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { UserLogin } from "../Store/userSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const userData = useSelector((state) => state.user.userData);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const handleLogin = async (data) => {
    try {
      if (data) {
        console.log(data);
        dispatch(UserLogin(data)).unwrap();
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (userData?.user?.email) {
    navigate("/dashboard");
  }

  return (
    <div className="font-[Poppins] select-none overflow-hidden flex justify-center items-center bg-white dark:bg-black text-black dark:text-white min-h-screen pt-10 md:pt-20">
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="bg-white dark:bg-black text-black dark:text-white p-6 md:p-10 flex flex-col rounded-[20px] md:rounded-[30px] shadow-lg dark:shadow-gray-700 gap-6 w-[95%] max-w-[480px] mx-4">
          {/* Email Input */}
          <div className="bg-white dark:bg-black text-black dark:text-white shadow-md dark:shadow-gray-900 p-4 md:p-5 flex flex-col gap-3 rounded-[15px] md:rounded-[20px]  -mt-6">
            <label htmlFor="email" className="text-sm md:text-base">
              Email Address
            </label>
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 bg-white dark:bg-black text-black dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                type="email"
                name="email"
                placeholder="Username@gmail.com"
                className="outline-none  border-none text-sm md:text-base bg-white dark:bg-black text-black dark:text-white bg-transparent w-full"
                {...register("email", {
                  required: "email is required",
                })}
              />
            </div>
            {errors.email && (
              <span className="text-xs md:text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password Input */}
          <div className="bg-white dark:bg-black text-black dark:text-white shadow-md dark:shadow-gray-900 p-4 md:p-5 flex flex-col gap-3 rounded-[15px] md:rounded-[20px] ">
            <label htmlFor="password" className="text-sm md:text-base">
              Password
            </label>
            <div className="flex items-center gap-3">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="············"
                className="outline-none border-none text-sm md:text-base bg-white dark:bg-black text-black dark:text-white bg-transparent w-full"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {showPassword ? (
                <EyeClosed
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  className="bg-white dark:bg-black text-black dark:text-white h-5 w-5 cursor-pointer"
                />
              ) : (
                <EyeIcon
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  className="bg-white dark:bg-black text-black dark:text-white h-5 w-5 cursor-pointer"
                />
              )}
            </div>
            {errors.password && (
              <span className="text-xs md:text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="p-3 bg-black dark:bg-white text-white dark:text-black border-none rounded-full font-semibold text-sm md:text-base hover:opacity-90 transition"
          >
            Login
          </button>

          {/* Links */}
          <div className="flex text-[0.75em] md:text-[0.8em] bg-white dark:bg-black text-black dark:text-white justify-between pb-4">
            <span
              onClick={() => {
                navigate("/signup");
              }}
              className="cursor-pointer hover:underline"
            >
              Signup
            </span>
            <span className="cursor-pointer hover:underline">
              Forgot Password?
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
