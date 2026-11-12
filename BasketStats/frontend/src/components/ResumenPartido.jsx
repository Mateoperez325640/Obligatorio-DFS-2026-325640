import { useState } from "react";
import { generarResumenPartidoApi } from "../services/resumenPartidoServices.js";

function ResumenPartido({ idPartido }) {
  const [resumen, setResumen] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const generarResumen = async () => {
    setError("");
    setCargando(true);

    try {
      const respuesta = await generarResumenPartidoApi(idPartido);

      if (typeof respuesta?.resumen !== "string" || !respuesta.resumen.trim()) {
        setError("La IA no devolvió un resumen válido.");
        return;
      }

      setResumen(respuesta.resumen);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "No se pudo generar el resumen. Intentá nuevamente.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="resumen-partido">
      <h4>Resumen con inteligencia artificial</h4>

      <button type="button" onClick={generarResumen} disabled={cargando}>
        {cargando
          ? "Generando resumen..."
          : resumen
            ? "Generar otro resumen"
            : "Generar resumen con IA"}
      </button>

      {error && <p className="error">{error}</p>}

      {resumen && (
        <div
          style={{
            marginTop: "12px",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <p style={{ whiteSpace: "pre-wrap" }}>{resumen}</p>
        </div>
      )}
    </div>
  );
}

export default ResumenPartido;
