import express from "express";
import { crear } from "../controller/match.controller.js";
import autenticarToken from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";
import { partidoBodySchema } from "../schemas/match-body.schema.js";

const router = express.Router();

router.post("/", autenticarToken, validate(partidoBodySchema), crear);

export default router;
