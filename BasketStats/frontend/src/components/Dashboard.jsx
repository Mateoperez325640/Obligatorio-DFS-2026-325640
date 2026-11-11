import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  cerrarSesionSlice,
  actualizarUsuarioSlice,
} from "../redux/features/sesionSlice.js";
import CrearPartido from "./CrearPartido.jsx";
import EditarPartido from "./EditarPartido.jsx";
import InformeUso from "./InformeUso.jsx";
import CambioPlan from "./CambioPlan.jsx";
import GraficoPartidos from "./GraficoPartidos.jsx";
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

  const [mostrarCrearPartido, setMostrarCrearPartido] = useState(false);
  const [idPartidoEditando, setIdPartidoEditando] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState("");

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

  const partidoCreado = async () => {
    setMostrarCrearPartido(false);
    setError("");

    try {
      const respuestaPartidos = await obtenerPartidosApi();
      setPartidos(respuestaPartidos);
    } catch (error) {
      setError("El partido se creó, pero no se pudo actualizar el listado.");
    }
  };

  const partidoActualizado = async () => {
    setIdPartidoEditando(null);
    setError("");

    try {
      const respuestaPartidos = await obtenerPartidosApi();
      setPartidos(respuestaPartidos);
    } catch (error) {
      setError(
        "El partido se actualizó, pero no se pudo actualizar el listado.",
      );
    }
  };

  const seleccionarPartidoEditar = (idPartido) => {
    setMostrarCrearPartido(false);

    if (idPartidoEditando === idPartido) {
      setIdPartidoEditando(null);
    } else {
      setIdPartidoEditando(idPartido);
    }
  };

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

      if (idPartidoEditando === idPartido) {
        setIdPartidoEditando(null);
      }

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

  const planCambiado = (usuarioActualizado) => {
    if (!usuarioActualizado) {
      setError("El backend no devolvió los datos del usuario actualizado.");
      return;
    }

    const nuevosDatosUsuario = {
      ...usuario,
      ...usuarioActualizado,
    };

    localStorage.setItem("usuario", JSON.stringify(nuevosDatosUsuario));

    dispatch(actualizarUsuarioSlice(nuevosDatosUsuario));
    setError("");
  };

  const limiteAlcanzado =
    usuario?.plan?.toLowerCase() === "plus" &&
    partidos !== null &&
    partidos.total >= 4;

  const partidosFiltrados = partidos
    ? partidos.partidos.filter(
        (partido) =>
          filtroCategoria === "" || partido.category === filtroCategoria,
      )
    : [];

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

      {!cargando && partidos && (
        <InformeUso plan={usuario.plan} cantidadPartidos={partidos.total} />
      )}

      {usuario.role !== "admin" && (
        <CambioPlan plan={usuario.plan} onPlanCambiado={planCambiado} />
      )}

      <h3>Mis partidos</h3>

      <div className="campo">
        <label htmlFor="filtroCategoria">Filtrar por categoría</label>

        <select
          id="filtroCategoria"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="">Todas las categorías</option>

          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        disabled={cargando || (limiteAlcanzado && !mostrarCrearPartido)}
        onClick={() => {
          setIdPartidoEditando(null);
          setMostrarCrearPartido(!mostrarCrearPartido);
        }}
      >
        {mostrarCrearPartido ? "Ocultar formulario" : "+ Crear partido"}
      </button>

      {limiteAlcanzado && (
        <p>
          Alcanzaste el límite de 4 partidos de tu plan Plus. Para crear más
          partidos, cambiá a Premium o eliminá alguno de los existentes.
        </p>
      )}

      {mostrarCrearPartido && (
        <CrearPartido
          onPartidoCreado={partidoCreado}
          onVolver={() => setMostrarCrearPartido(false)}
        />
      )}

      {cargando && <p>Cargando partidos...</p>}

      {error && <p className="error">{error}</p>}

      {!cargando && partidos && (
        <>
          <p>
            <strong>Total de partidos:</strong> {partidos.total}
          </p>

          {partidosFiltrados.length === 0 ? (
            <p>No hay partidos para mostrar con el filtro seleccionado.</p>
          ) : (
            <div>
              {partidosFiltrados.map((partido) => {
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
                      onClick={() => seleccionarPartidoEditar(partido.id)}
                    >
                      {idPartidoEditando === partido.id
                        ? "Ocultar edición"
                        : "Editar partido"}
                    </button>

                    <button
                      type="button"
                      onClick={() => eliminarPartido(partido.id)}
                      disabled={eliminando}
                    >
                      {eliminando ? "Procesando..." : "Eliminar partido"}
                    </button>

                    {idPartidoEditando === partido.id && (
                      <EditarPartido
                        idPartido={partido.id}
                        onPartidoActualizado={partidoActualizado}
                        onVolver={() => setIdPartidoEditando(null)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {!cargando && partidos && (
        <GraficoPartidos partidos={partidos.partidos} equipos={equipos} />
      )}

      <button type="button" onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Dashboard;
