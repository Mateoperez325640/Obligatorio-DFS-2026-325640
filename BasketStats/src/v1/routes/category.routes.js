import express from "express";
import { crear, obtenerTodas } from "../controller/category.controller.js";
import autenticarToken from "../middleware/auth.middleware.js";
import soloAdmin from "../middleware/role.middleware.js";
import validate from "../middleware/validation.middleware.js";
import { categoriaBodySchema } from "../schemas/category-body.schema.js";

const router = express.Router();

router.get("/", autenticarToken, obtenerTodas);

router.post(
  "/",
  autenticarToken,
  soloAdmin,
  validate(categoriaBodySchema),
  crear,
);

export default router;
