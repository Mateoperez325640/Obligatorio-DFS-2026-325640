import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectMongo } from "./src/v1/config/mongo.config.js";
import routes from "./src/v1/routes/index.js";
import { middlewareErrores } from "./src/v1/middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).json({
    message: "BasketStats funcionando correctamente",
  });
});

//app.use("/api", routes);

app.use(
  "/api",

  async (req, res, next) => {
    try {
      await connectMongo();
      next();
    } catch (error) {
      next(error);
    }
  },

  routes,
);

app.use(middlewareErrores);

//connectMongo();

app.listen(PORT, () => {
  console.log(`Servidor levantado en el puerto ${PORT}`);
});

export default app;
