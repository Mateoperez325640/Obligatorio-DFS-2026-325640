import express from "express";
import { obtenerFeriadosUruguayController } from "../controller/api-externa.controller.js";
import autenticarToken from "../middleware/auth.middleware.js";
import { validateParams } from "../middleware/validation.middleware.js";
import { anioParamSchema } from "../schemas/api-externa-params.schema.js";

const router = express.Router();

router.get(
  "/feriados/:anio",
  autenticarToken,
  validateParams(anioParamSchema),
  obtenerFeriadosUruguayController,
);

export default router;
