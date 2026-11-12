import { useSelector } from "react-redux";

function GraficoPartidos() {
  const partidos = useSelector((state) => state.partidos.lista);
  const equipos = useSelector((state) => state.catalogos.equipos);

  const partidosGrafico = partidos.slice(0, 5);

  if (partidosGrafico.length === 0) {
    return (
      <div>
        <h3>Estadísticas de partidos</h3>
        <p>No hay partidos para mostrar en el gráfico.</p>
      </div>
    );
  }

  const puntajeMaximo = Math.max(
    1,
    ...partidosGrafico.flatMap((partido) => [
      partido.localScore,
      partido.visitorScore,
    ]),
  );

  const obtenerNombreEquipo = (idEquipo) => {
    const equipo = equipos.find((equipo) => equipo.id === idEquipo);

    return equipo?.name || "Equipo desconocido";
  };

  return (
    <div className="grafico-partidos">
      <h3>Estadísticas de partidos</h3>

      <p>Comparación de puntos por partido</p>

      {partidosGrafico.map((partido) => (
        <div
          key={partido.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "15px",
          }}
        >
          <h4>
            {obtenerNombreEquipo(partido.localTeam)}
            {" vs "}
            {obtenerNombreEquipo(partido.visitorTeam)}
          </h4>

          <p>
            {obtenerNombreEquipo(partido.localTeam)}: {partido.localScore}{" "}
            puntos
          </p>

          <div
            style={{
              backgroundColor: "#e5e7eb",
              height: "20px",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                width: `${(partido.localScore / puntajeMaximo) * 100}%`,
                backgroundColor: "#2563eb",
                height: "100%",
                borderRadius: "5px",
              }}
            />
          </div>

          <p>
            {obtenerNombreEquipo(partido.visitorTeam)}: {partido.visitorScore}{" "}
            puntos
          </p>

          <div
            style={{
              backgroundColor: "#e5e7eb",
              height: "20px",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                width: `${(partido.visitorScore / puntajeMaximo) * 100}%`,
                backgroundColor: "#f97316",
                height: "100%",
                borderRadius: "5px",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default GraficoPartidos;
