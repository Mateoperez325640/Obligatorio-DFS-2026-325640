import { useState } from "react";
import { cambiarPlanApi } from "../services/planesServices.js";

function CambioPlan({ plan, onPlanCambiado }) {
  const [cambiando, setCambiando] = useState(false);
  const [error, setError] = useState("");

  const cambiarPlan = async () => {
    const confirmar = window.confirm("¿Querés cambiar tu plan Plus a Premium?");

    if (!confirmar) {
      return;
    }

    setError("");
    setCambiando(true);

    try {
      const respuesta = await cambiarPlanApi();

      if (onPlanCambiado) {
        onPlanCambiado(respuesta.user);
      }
    } catch (error) {
      setError(error.response?.data?.message || "No se pudo cambiar el plan.");
    } finally {
      setCambiando(false);
    }
  };

  return (
    <div className="cambio-plan">
      <h3>Cambiar de plan</h3>

      {plan?.toLowerCase() === "plus" ? (
        <div>
          <p>Actualmente tenés el plan Plus, con un límite de 4 partidos.</p>

          <p>Con Premium podés registrar partidos sin límite.</p>

          <button type="button" onClick={cambiarPlan} disabled={cambiando}>
            {cambiando ? "Actualizando plan..." : "Cambiar a Premium"}
          </button>
        </div>
      ) : (
        <p>Ya tenés el plan Premium.</p>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default CambioPlan;
