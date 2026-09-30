import express from "express";
import { cambiarPlan } from "../controller/user.controller.js";
import autenticarToken from "../middleware/auth.middleware.js";

const router = express.Router();

router.patch("/plan", autenticarToken, cambiarPlan);

export default router;
