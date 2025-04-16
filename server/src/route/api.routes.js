import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { MarketTrendsApi } from "../controller/api.controller.js";
import { RealTimeStockApi } from "../controller/api.controller.js";

const router = Router()

router.route("/market-trends").get(AuthMiddleware,MarketTrendsApi)
router.route("/real-time-stock").get(AuthMiddleware,RealTimeStockApi)

export {router}