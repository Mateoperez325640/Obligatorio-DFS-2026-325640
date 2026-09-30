import express from "express";

import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import matchRoutes from "./match.routes.js";
import categoryRoutes from "./category.routes.js";
import teamRoutes from "./team.routes.js";
import playerRoutes from "./player.routes.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        message: "BasketStats v1 funcionando correctamente"
    });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/matches", matchRoutes);
router.use("/categories", categoryRoutes);
router.use("/teams", teamRoutes);
router.use("/players", playerRoutes);

export default router;