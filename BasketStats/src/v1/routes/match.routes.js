import express from "express";
import {
  crear,
  obtenerTodos,
  obtenerPorId,
  modificar,
  eliminar,
} from "../controller/match.controller.js";
import autenticarToken from "../middleware/auth.middleware.js";
import {
  default as validate,
  validateParams,
  validateQuery,
} from "../middleware/validation.middleware.js";
import {
  partidoBodySchema,
  modificarPartidoBodySchema,
} from "../schemas/match-body.schema.js";
import { listarPartidosQuerySchema } from "../schemas/match-query.schema.js";
import { idParamSchema } from "../schemas/common.schema.js";

const router = express.Router();

router.get(
  "/",
  autenticarToken,
  validateQuery(listarPartidosQuerySchema),
  obtenerTodos,
);

router.get(
  "/:id",
  autenticarToken,
  validateParams(idParamSchema),
  obtenerPorId,
);

router.patch(
  "/:id",
  autenticarToken,
  validateParams(idParamSchema),
  validate(modificarPartidoBodySchema),
  modificar,
);

router.delete("/:id", autenticarToken, validateParams(idParamSchema), eliminar);

router.post("/", autenticarToken, validate(partidoBodySchema), crear);

export default router;
