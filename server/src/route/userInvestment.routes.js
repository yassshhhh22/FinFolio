import { Router } from "express";
import {
  getAllUserInvestments,
  createUserInvestment,
  updateUserInvestment,
  deleteUserInvestment,
} from "../controller/userInvestment.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/")
  .get(AuthMiddleware, getAllUserInvestments) 
  .post(AuthMiddleware, createUserInvestment); 

router.route("/:investmentId")
  .patch(AuthMiddleware, updateUserInvestment) 
  .delete(AuthMiddleware, deleteUserInvestment); 

export default router;