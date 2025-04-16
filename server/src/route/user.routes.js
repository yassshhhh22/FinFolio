import { Router } from "express";
import {
  loginUser,
  registerUser,
  verifyOtp,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  getCurrentUser,
} from "../controller/user.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Corrected user.route.js
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/verify-otp").post(verifyOtp);
router.route("/logout").post(AuthMiddleware, logoutUser);
router.route("/refresh-access-token").post(refreshAccessToken);
router.route("/change-password").post(AuthMiddleware, changeCurrentPassword);
router.route("/current-user").get(AuthMiddleware, getCurrentUser);
router.route("/update-account").patch(AuthMiddleware, updateAccountDetails);

export default router;
