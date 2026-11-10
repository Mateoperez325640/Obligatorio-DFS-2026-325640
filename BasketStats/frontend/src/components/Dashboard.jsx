import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cerrarSesionSlice } from "../redux/features/sesionSlice.js";
import {
  obtenerPartidosApi,
  eliminarPartidoApi,
} from "../services/partidosServices.js";
import {
  obtenerEquiposApi,
  obtenerCategoriasApi,
} from "../services/catalogosServices.js";

function Dashboard() {
  const usuario = useSelector((state) => state.sesion.usuario);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [partidos, setPartidos] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    const cargarPartidos = async () => {
      try {
        const respuestaPartidos = await obtenerPartidosApi();
        const respuestaEquipos = await obtenerEquiposApi();
        const respuestaCategorias = await obtenerCategoriasApi();

        setPartidos(respuestaPartidos);
        setEquipos(respuestaEquipos.equipos);
        setCategorias(respuestaCategorias.categorias);
      } catch (error) {
        if (error.response?.status === 401) {
          setError("La sesión fue rechazada. Volvé a iniciar sesión.");
        } else {
          setError("No se pudieron cargar los partidos.");
        }
      } finally {
        setCargando(false);
      }
    };

    cargarPartidos();
  }, []);

  const eliminarPartido = async (idPartido) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que querés eliminar este partido?",
    );

    if (!confirmar) {
      return;
    }

    setError("");
    setEliminando(true);

    try {
      await eliminarPartidoApi(idPartido);

      const respuestaPartidos = await obtenerPartidosApi();
      setPartidos(respuestaPartidos);
    } catch (error) {
      setError(
        error.response?.data?.message || "No se pudo eliminar el partido.",
      );
    } finally {
      setEliminando(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    dispatch(cerrarSesionSlice());

    navigate("/login");
  };

  if (!usuario) {
    return (
      <div className="login">
        <h2>No hay una sesión activa</h2>
        <p>Debés iniciar sesión para continuar.</p>
      </div>
    );
  }

  return (
    <div className="login">
      <h2>Mi panel</h2>

      <p>Bienvenido, {usuario.name}</p>

      <p>
        <strong>Usuario:</strong> {usuario.username}
      </p>

      <p>
        <strong>Rol:</strong> {usuario.role}
      </p>

      <p>
        <strong>Plan:</strong> {usuario.plan}
      </p>

      {usuario.role === "admin" && (
        <button type="button" onClick={() => navigate("/admin")}>
          Panel de administración
        </button>
      )}

      <h3>Mis partidos</h3>

      <button type="button" onClick={() => navigate("/partidos/crear")}>
        + Crear partido
      </button>

      {cargando && <p>Cargando partidos...</p>}

      {error && <p className="error">{error}</p>}

      {!cargando && partidos && (
        <>
          <p>
            <strong>Total de partidos:</strong> {partidos.total}
          </p>

          {partidos.partidos.length === 0 ? (
            <p>Todavía no tenés partidos registrados.</p>
          ) : (
            <div>
              {partidos.partidos.map((partido) => {
                const equipoLocal = equipos.find(
                  (equipo) => equipo.id === partido.localTeam,
                );

                const equipoVisitante = equipos.find(
                  (equipo) => equipo.id === partido.visitorTeam,
                );

                const categoriaPartido = categorias.find(
                  (categoria) => categoria.id === partido.category,
                );

                return (
                  <div
                    key={partido.id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "15px",
                      marginBottom: "15px",
                    }}
                  >
                    <h4>
                      {equipoLocal?.name || "Equipo local"}
                      {" vs "}
                      {equipoVisitante?.name || "Equipo visitante"}
                    </h4>

                    <p>
                      <strong>Categoría:</strong>{" "}
                      {categoriaPartido?.name || "Sin categoría"}
                    </p>

                    <p>
                      <strong>Resultado:</strong> {partido.localScore} -{" "}
                      {partido.visitorScore}
                    </p>

                    <p>
                      <strong>Fecha:</strong>{" "}
                      {new Date(partido.date).toLocaleDateString("es-UY", {
                        timeZone: "UTC",
                      })}
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate(`/partidos/editar/${partido.id}`)}
                    >
                      Editar partido
                    </button>

                    <button
                      type="button"
                      onClick={() => eliminarPartido(partido.id)}
                      disabled={eliminando}
                    >
                      {eliminando ? "Procesando..." : "Eliminar partido"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </div>
  );
}

export default Dashboard;
