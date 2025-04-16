import { Router } from "express";
import healthcheck from "../controller/healthcheck.controller.js";

const router = Router();

router.get("/", healthcheck);

export default router;
