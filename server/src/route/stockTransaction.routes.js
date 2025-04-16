import express from "express";
import fetchUserInvestments, {
  buySellStock,
  
} from "../controller/stockTransaction.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/trade",AuthMiddleware, buySellStock);
router.get("/investments",AuthMiddleware, fetchUserInvestments);

export default router;
