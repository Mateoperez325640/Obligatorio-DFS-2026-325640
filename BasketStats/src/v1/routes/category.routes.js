import express from "express";
import {
  crear,
  obtenerTodas,
  obtenerPorId,
  modificar,
} from "../controller/category.controller.js";
import autenticarToken from "../middleware/auth.middleware.js";
import soloAdmin from "../middleware/role.middleware.js";
import validate, {
  validateParams,
} from "../middleware/validation.middleware.js";
import { idParamSchema } from "../schemas/common.schema.js";
import { categoriaBodySchema } from "../schemas/category-body.schema.js";

const router = express.Router();

router.get("/", autenticarToken, obtenerTodas);

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
  validate(categoriaBodySchema),
  crear,
);

router.patch(
  "/:id",
  autenticarToken,
  soloAdmin,
  validateParams(idParamSchema),
  validate(categoriaBodySchema),
  modificar,
);

export default router;
