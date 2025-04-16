import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const stocksSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  stock: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    Currentprice: {
      type: String,
      required: true,
      trim: true,
    },
  },
});

export const Stocks = mongoose.model("Stocks", stocksSchema);
