import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_name } from "../utils/constants.js";
dotenv.config();

const DBconnect = async () => {
  try {
     await mongoose.connect(`${process.env.MONGO_URI}/${DB_name}`);
    console.log("\n MongoDB Connected Successfully");
  } catch (error) {
    console.log("Error in DBconnect::", error);
    process.exit(1);
  }
};

export default DBconnect;
