import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router as ApiRouter } from "./route/api.routes.js";
import userInvestmentRouter from "./route/userInvestment.routes.js";
import stockTransactionRouter from "./route/stockTransaction.routes.js";
import equityRouter from "./route/equity.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));

app.use(cookieParser());

import healthcheckRouter from "./route/healthcheck.routes.js";
import userRouter from "./route/user.routes.js";
app.use('/v1/api/equity-portfolio', equityRouter);
app.use("/v1/healthcheck", healthcheckRouter);
app.use("/v1/users", userRouter);
app.use("/v1/api", ApiRouter);
app.use("/v1/investments", userInvestmentRouter);
app.use("/v1/stocks", stockTransactionRouter);

export default app;
