import asynchandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateAccessAndRefreshtokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh access token"
    );
  }
};

export const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid password");
  }

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const { accessToken, refreshToken } = await generateAccessAndRefreshtokens(
    user._id
  );
  console.log(loggedInUser)
  console.log(user)


  const options = { httpOnly: true, secure: true, sameSite: "none" };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        "User logged in successfully"
      )
    );
});

export const registerUser = asynchandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  if (!fullname || !email || !username || !password || password.trim() === "") {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Registration",
    text: `Your OTP is ${otp}. It will expire in 15 minutes.`,
  });

 const user = await User.create({
    fullname,
    email,
    username,
    password,
    verifyCode: otp.toString(),
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        user,
        "User registered successfully. Verify OTP sent to your email to complete registration."
      )
    );
});

export const verifyOtp = asynchandler(async (req, res) => {
  const { otp, email } = req.body;
  
  console.log(otp, email);
  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }
  console.log(otp);
  
  const user = await User.findOne({ email:email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  console.log(user.verifyCode);
  
  if (String(otp).trim() !== user.verifyCode) {
    throw new ApiError(401, "Invalid OTP");
  }
  
  user.isVerified = true;
  await user.save();
  return res.json(new ApiResponse(200, {}, "Email Verification Successful"));
});

export const logoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: "" });
  const options = { httpOnly: true, secure: true };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export const refreshAccessToken = asynchandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(400, "Refresh token is required");
  }

  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decoded?.id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshtokens(
      user._id
    );

    const options = { httpOnly: true, secure: true };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export const changeCurrentPassword = asynchandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);

  const ispasswordMatch = await user.comparePassword(oldPassword);
  if (!ispasswordMatch) {
    throw new ApiError(400, "Invalid password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export const getCurrentUser = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User details fetched successfully"));
});

export const updateAccountDetails = asynchandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized request");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { fullname, email }, // Corrected update object
    { new: true }
  )
    .select("-password")
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});
