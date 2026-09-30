import express from "express";
import cors from "cors";
import "dotenv/config";
import connectMongo from "./src/v1/config/mongo.config.js";
import routes from "./src/v1/routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).json({
    message: "BasketStats funcionando correctamente",
  });
});

app.use("/api", routes);

connectMongo();

app.listen(PORT, () => {
  console.log(`Servidor levantado en el puerto ${PORT}`);
});
