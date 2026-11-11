function InformeUso({ plan, cantidadPartidos }) {
  const limitePlus = 4;
  const planActual = plan?.toLowerCase();

  const porcentajeUso = (cantidadPartidos / limitePlus) * 100;
  const porcentajeBarra = Math.min(porcentajeUso, 100);
  const partidosDisponibles = Math.max(limitePlus - cantidadPartidos, 0);

  return (
    <div className="informe-uso">
      <h3>Informe de uso</h3>

      <p>
        <strong>Plan actual:</strong> {plan}
      </p>

      {planActual === "plus" ? (
        <div>
          <p>
            Partidos registrados: {cantidadPartidos} de {limitePlus}
          </p>

          <p>Porcentaje utilizado: {porcentajeUso.toFixed(0)}%</p>

          <progress value={porcentajeBarra} max="100" />

          <p>Partidos disponibles: {partidosDisponibles}</p>

          {partidosDisponibles === 0 && (
            <p>Alcanzaste el límite de tu plan Plus.</p>
          )}
        </div>
      ) : planActual === "premium" ? (
        <div>
          <p>Partidos registrados: {cantidadPartidos}</p>

          <p>Tu plan Premium permite registrar partidos sin límite.</p>
        </div>
      ) : (
        <p>No hay información de uso para este plan.</p>
      )}
    </div>
  );
}

export default InformeUso;
