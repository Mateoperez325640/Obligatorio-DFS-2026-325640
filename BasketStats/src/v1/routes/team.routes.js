import express from "express";
import {
  crear,
  obtenerTodos,
  obtenerPorId,
} from "../controller/team.controller.js";
import autenticarToken from "../middleware/auth.middleware.js";
import soloAdmin from "../middleware/role.middleware.js";
import validate, {
  validateParams,
} from "../middleware/validation.middleware.js";
import { idParamSchema } from "../schemas/common.schema.js";
import { equipoBodySchema } from "../schemas/team-body.schema.js";

const router = express.Router();

router.get("/", autenticarToken, obtenerTodos);

router.get(
  "/:id",
  autenticarToken,
  validateParams(idParamSchema),
  obtenerPorId,
);

router.post("/", autenticarToken, soloAdmin, validate(equipoBodySchema), crear);

export default router;
