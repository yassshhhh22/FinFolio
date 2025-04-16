import UserInvestment  from "../model/userInvestment.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import asynchandler from "express-async-handler";

// Get all user investments
export const getAllUserInvestments = asynchandler(async (req, res) => {
  const investments = await UserInvestment.getUserInvestmentsWithDetails();
  return res
    .status(200)
    .json(new ApiResponse(200, investments, "User investments fetched successfully"));
});

// Create a new user investment
export const createUserInvestment = asynchandler(async (req, res) => {
  const { userId, investedAmount } = req.body;

  if (!userId || !investedAmount) {
    throw new ApiError(400, "User ID and invested amount are required");
  }

  const newInvestment = await UserInvestment.create({
    userId,
    investedAmount,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newInvestment, "User investment created successfully"));
});

// Update a user investment
export const updateUserInvestment = asynchandler(async (req, res) => {
  const { investmentId } = req.params;
  const { overallProfitLoss, todaysGain } = req.body;

  const updatedInvestment = await UserInvestment.findByIdAndUpdate(
    investmentId,
    { overallProfitLoss, todaysGain },
    { new: true }
  );

  if (!updatedInvestment) {
    throw new ApiError(404, "Investment not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedInvestment, "User investment updated successfully"));
});

// Delete a user investment
export const deleteUserInvestment = asynchandler(async (req, res) => {
  const { investmentId } = req.params;

  const deletedInvestment = await UserInvestment.findByIdAndDelete(investmentId);

  if (!deletedInvestment) {
    throw new ApiError(404, "Investment not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User investment deleted successfully"));
});