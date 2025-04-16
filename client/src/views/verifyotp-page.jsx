import React from "react";
import { useForm } from "react-hook-form";
import { AxiosInstance } from "../Utils/AxiosInstance.js";
import { ApiError } from "../../../server/src/utils/apiError";
import { useNavigate, useParams } from "react-router";
import {useSelector} from "react-redux";
const VerifyOtp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);  
  const handleEmailVerification = async (data) => {
    try {
      const response = await AxiosInstance.post(
        "/v1/users/verify-otp",
        {
          otp: data.verifyCode,
          email: userData.email,
        }
      );
      console.log(response)
      if (response.data.statusCode !== 200) {
        throw new ApiError(500, "Email Verification Failed");
      }
      console.log("Email Verified");
      navigate("/signin");
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="font-[Poppins] select-none overflow-hidden flex justify-center items-center bg-[#dde5f4] h-screen pt-20">
      <form onSubmit={handleSubmit(handleEmailVerification)}>
        <div className="bg-[#f1f7fe] p-10 flex flex-col rounded-[30px] shadow-[0_0_2em_#e6e9f9] gap-6 w-[90%] max-w-[400px]">
          <div className="bg-white shadow-[0_0_2em_#e6e9f9] p-5 flex flex-col gap-3 rounded-[20px] text-[#4d4d4d] -mt-6">
            <label htmlFor="otp" className="text-base">
              Enter OTP
            </label>
            <div className="flex items-center gap-3">
              <ion-icon
                name="key-outline"
                className="text-[#4d4d4d] text-xl"
              ></ion-icon>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                className="outline-none border-none text-base text-black w-full"
                style={{ paddingRight: "1rem", width: "100%" }}
                {...register("verifyCode", {
                  required: ["verify code is required"],
                })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="p-3 bg-[#3e4684] text-white border-none rounded-full font-semibold text-base hover:opacity-90 transition"
          >
            Verify OTP & Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtp;
