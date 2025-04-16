import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userHoldingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  holdings: {
    type: mongoose.Types.ObjectId,
    ref: "Stocks",
  },
});

export const UserHoldings = mongoose.model("UserHoldings", userHoldingSchema);
