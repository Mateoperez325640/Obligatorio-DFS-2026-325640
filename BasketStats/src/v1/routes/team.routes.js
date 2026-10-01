import express from "express";
import { crear, obtenerTodos } from "../controller/team.controller.js";
import autenticarToken from "../middleware/auth.middleware.js";
import soloAdmin from "../middleware/role.middleware.js";
import validate from "../middleware/validation.middleware.js";
import { equipoBodySchema } from "../schemas/team-body.schema.js";

const router = express.Router();

router.get("/", autenticarToken, obtenerTodos);

router.post("/", autenticarToken, soloAdmin, validate(equipoBodySchema), crear);

export default router;
