import express from "express";
import { registro, login } from "../controller/auth.controller.js";
import validate from "../middleware/validation.middleware.js";
import { registrarBodySchema } from "../schemas/register-body.schema.js";
import { loginBodySchema } from "../schemas/login-body.schema.js";

const router = express.Router();

router.post("/registrar", validate(registrarBodySchema), registro);

router.post("/login", validate(loginBodySchema), login);

export default router;
