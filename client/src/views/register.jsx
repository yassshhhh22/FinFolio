import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { EyeClosed, EyeIcon, UserCircle, User, Mail, Lock } from "lucide-react";
import { RegisterUser } from "../Store/userSlice";
import { useDispatch, useSelector } from "react-redux";
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignUp = async (data) => {
    try {
      if (data) {
        console.log(data);
        dispatch(RegisterUser(data)).unwrap();
        navigate(`/verify-email`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (userData?.data?.email) {
    navigate("/dashboard");
  }
  return (
    <div className="font-[Poppins] select-none overflow-hidden flex justify-center items-center bg-white dark:bg-black text-black dark:text-white h-auto min-h-screen py-6">
      <form onSubmit={handleSubmit(handleSignUp)}>
        <div className="bg-white dark:bg-black text-black dark:text-white p-6 flex flex-col rounded-[30px] shadow-lg dark:shadow-gray-700 gap-4 w-[105%] max-w-[500px]">
          {/* Name Input */}
          <div className="bg-white dark:bg-black text-black dark:text-white shadow-md dark:shadow-gray-900 p-3 flex flex-col gap-2 rounded-[20px] -mt-4">
            <label htmlFor="name" className="text-sm">
              Name
            </label>
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 bg-white dark:bg-black text-black dark:text-white" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="outline-none border-none text-sm bg-white dark:bg-black text-black dark:text-white bg-transparent w-full"
                {...register("fullname", {
                  required: ["full name is required"],
                })}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-black text-black dark:text-white shadow-md dark:shadow-gray-900 p-3 flex flex-col gap-2 rounded-[20px]">
            <label htmlFor="username" className="text-sm">
              Username
            </label>
            <div className="flex items-center gap-3">
              <UserCircle className="h-4 w-4 bg-white dark:bg-black text-black dark:text-white" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="outline-none border-none text-sm bg-white dark:bg-black text-black dark:text-white bg-transparent w-full"
                {...register("username", {
                  required: ["username is required"],
                })}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="bg-white dark:bg-black text-black dark:text-white shadow-md dark:shadow-gray-900 p-3 flex flex-col gap-2 rounded-[20px]">
            <label htmlFor="email" className="text-sm">
              Email Address
            </label>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 bg-white dark:bg-black text-black dark:text-white" />
              <input
                type="email"
                name="email"
                placeholder="Username@gmail.com"
                className="outline-none border-none text-sm bg-white dark:bg-black text-black dark:text-white bg-transparent w-full"
                {...register("email", {
                  required: ["email is required"],
                })}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="bg-white dark:bg-black text-black dark:text-white shadow-md dark:shadow-gray-900 p-3 flex flex-col gap-2 rounded-[20px]">
            <label htmlFor="password" className="text-sm">
              Password
            </label>
            <div className="flex items-center gap-3">
              <Lock className="h-4 w-4 bg-white dark:bg-black text-black dark:text-white" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                className="outline-none border-none text-sm bg-white dark:bg-black text-black dark:text-white bg-transparent w-full"
                {...register("password", {
                  required: ["password is required"],
                })}
              />
              {showPassword ? (
                <EyeClosed
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  className="bg-white dark:bg-black text-black dark:text-white h-4 w-4 cursor-pointer"
                />
              ) : (
                <EyeIcon
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  className="bg-white dark:bg-black text-black dark:text-white h-4 w-4 cursor-pointer"
                />
              )}
            </div>
          </div>

          {/* Verify Email Button */}
          <button
            type="submit"
            className="p-2 bg-black dark:bg-white text-white dark:text-black border-none rounded-full font-semibold text-sm hover:opacity-90 transition"
          >
            Verify Email
          </button>
        </div>
      </form>
    </div>
  );
};
export default Register;
