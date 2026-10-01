import express from "express";
import {
  crear,
  obtenerTodos,
  obtenerPorId,
} from "../controller/player.controller.js";
import autenticarToken from "../middleware/auth.middleware.js";
import soloAdmin from "../middleware/role.middleware.js";
import validate, {
  validateParams,
} from "../middleware/validation.middleware.js";
import { idParamSchema } from "../schemas/common.schema.js";
import { jugadorBodySchema } from "../schemas/player-body.schema.js";

const router = express.Router();

router.get("/", autenticarToken, obtenerTodos);

router.get(
  "/:id",
  autenticarToken,
  validateParams(idParamSchema),
  obtenerPorId,
);

router.post(
  "/",
  autenticarToken,
  soloAdmin,
  validate(jugadorBodySchema),
  crear,
);

export default router;
