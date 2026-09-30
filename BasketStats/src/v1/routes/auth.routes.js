import express from "express";
import { registro } from "../controller/auth.controller.js";
import validate from "../middleware/validation.middleware.js";
import { registrarBodySchema } from "../schemas/register-body.schema.js";

const router = express.Router();

router.post("/registrar", validate(registrarBodySchema), registro);

export default router;
