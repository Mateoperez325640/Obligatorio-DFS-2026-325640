import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.IA_API_KEY;

if (!apiKey) {
  throw new Error("Falta la variable IA_API_KEY");
}

const genAI = new GoogleGenerativeAI(apiKey);

const iaModel = genAI.getGenerativeModel({
  model: "gemini-3.5-flash-lite",

  systemInstruction: {
    role: "system",
    parts: [
      {
        text: "Eres un asistente especializado en básquetbol. Tu única función es generar un resumen breve de un partido utilizando solamente los datos proporcionados. No inventes información y devuelve solamente el resumen, sin introducciones ni despedidas.",
      },
    ],
  },
});

export default iaModel;
