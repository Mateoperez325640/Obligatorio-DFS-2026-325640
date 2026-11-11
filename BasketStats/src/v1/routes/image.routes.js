import express from "express";
import { subir } from "../controller/image.controller.js";
import autenticarToken from "../middleware/auth.middleware.js";
import soloAdmin from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", autenticarToken, soloAdmin, subir);

export default router;
