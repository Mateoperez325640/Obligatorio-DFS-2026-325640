import iaModel from "../config/ia.config.js";

const wait = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

export const generarResumenPartido = async (
  datosPartido,
  maximumAttempts = 2,
) => {
  const resumenBasico = `${datosPartido.equipoLocal} ${datosPartido.puntajeLocal} - ${datosPartido.puntajeVisitante} ${datosPartido.equipoVisitante}.`;

  for (let attempt = 1; attempt <= maximumAttempts; attempt++) {
    try {
      const prompt = `
Genera un resumen breve del siguiente partido de básquetbol.
Utiliza solamente los datos proporcionados.
No inventes jugadores, estadísticas ni hechos que no aparezcan en los datos.
Devuelve únicamente el resumen.

Equipo local: ${datosPartido.equipoLocal}
Equipo visitante: ${datosPartido.equipoVisitante}
Resultado: ${datosPartido.puntajeLocal} - ${datosPartido.puntajeVisitante}
Categoría: ${datosPartido.categoria}
Fecha: ${datosPartido.fecha}
      `.trim();

      const result = await iaModel.generateContent(prompt);

      const resumen = result.response.text().trim();

      return resumen || resumenBasico;
    } catch (error) {
      console.error(
        `Error de IA. Intento ${attempt}/${maximumAttempts}:`,
        error.message,
      );

      const canRetry =
        error.message?.includes("429") ||
        error.message?.includes("500") ||
        error.message?.includes("503");

      if (canRetry && attempt < maximumAttempts) {
        const delay = attempt * 1000;

        console.log(`Reintentando petición a Gemini en ${delay} ms...`);

        await wait(delay);

        continue;
      }

      console.warn("Gemini no está disponible. Se devuelve un resumen básico.");

      return resumenBasico;
    }
  }

  return resumenBasico;
};
