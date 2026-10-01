/*import mongoose from "mongoose";

const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.MONGO_DATABASE
        });

        console.log("Conectado a MongoDB correctamente");
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectMongo;
*/
import "dotenv/config";
import mongoose from "mongoose";

let isConnected = false;

export async function connectMongo() {
  if (isConnected) {
    console.log("Ya está conectado a MongoDB correctamente");
    return;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("Falta MONGO_URI");
  }

  try {
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGO_DATABASE,
      serverSelectionTimeoutMS: 30000,
    });

    isConnected = true;

    console.log("Conectado a MongoDB correctamente");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    throw error;
  }
}
