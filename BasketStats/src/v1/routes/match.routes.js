import express from "express";
import { crear, obtenerTodos } from "../controller/match.controller.js";
import autenticarToken from "../middleware/auth.middleware.js";
import {
  default as validate,
  validateQuery,
} from "../middleware/validation.middleware.js";
import { partidoBodySchema } from "../schemas/match-body.schema.js";
import { listarPartidosQuerySchema } from "../schemas/match-query.schema.js";

const router = express.Router();

router.get(
  "/",
  autenticarToken,
  validateQuery(listarPartidosQuerySchema),
  obtenerTodos,
);

router.post("/", autenticarToken, validate(partidoBodySchema), crear);

export default router;
