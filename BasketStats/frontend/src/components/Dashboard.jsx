import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  cerrarSesionSlice,
  actualizarUsuarioSlice,
} from "../redux/features/sesionSlice.js";

import {
  cargarPartidosSlice,
  eliminarPartidoSlice,
  limpiarPartidosSlice,
} from "../redux/features/partidosSlice.js";

import {
  cargarCatalogosSlice,
  limpiarCatalogosSlice,
} from "../redux/features/catalogosSlice.js";

import { limpiarJugadoresSlice } from "../redux/features/jugadoresSlice.js";

import CrearPartido from "./CrearPartido.jsx";
import EditarPartido from "./EditarPartido.jsx";
import InformeUso from "./InformeUso.jsx";
import CambioPlan from "./CambioPlan.jsx";
import GraficoPartidos from "./GraficoPartidos.jsx";
import ResumenPartido from "./ResumenPartido.jsx";

import {
  obtenerPartidosApi,
  eliminarPartidoApi,
} from "../services/partidosServices.js";

import {
  obtenerEquiposApi,
  obtenerCategoriasApi,
} from "../services/catalogosServices.js";

const LIMITE_POR_PAGINA = 5;

function Dashboard() {
  const usuario = useSelector((state) => state.sesion.usuario);

  const partidos = useSelector((state) => state.partidos.lista);
  const totalPartidos = useSelector((state) => state.partidos.total);
  const totalFiltrado = useSelector((state) => state.partidos.totalFiltrado);
  const paginaActual = useSelector((state) => state.partidos.pagina);
  const limite = useSelector((state) => state.partidos.limite);

  const equipos = useSelector((state) => state.catalogos.equipos);
  const categorias = useSelector((state) => state.catalogos.categorias);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [cargandoPartidos, setCargandoPartidos] = useState(true);
  const [datosCargados, setDatosCargados] = useState(false);
  const [catalogosCargados, setCatalogosCargados] = useState(false);

  const [errorPartidos, setErrorPartidos] = useState("");
  const [errorCatalogos, setErrorCatalogos] = useState("");
  const [errorAccion, setErrorAccion] = useState("");

  const [eliminando, setEliminando] = useState(false);
  const [idPartidoEditando, setIdPartidoEditando] = useState(null);

  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [paginaSolicitada, setPaginaSolicitada] = useState(1);

  // Cargar equipos y categorías una sola vez al entrar.
  useEffect(() => {
    let activo = true;

    const cargarCatalogos = async () => {
      try {
        const [respuestaEquipos, respuestaCategorias] = await Promise.all([
          obtenerEquiposApi(),
          obtenerCategoriasApi(),
        ]);

        if (
          !Array.isArray(respuestaEquipos?.equipos) ||
          !Array.isArray(respuestaCategorias?.categorias)
        ) {
          throw new Error("La API devolvió catálogos inválidos.");
        }

        if (!activo) {
          return;
        }

        dispatch(
          cargarCatalogosSlice({
            equipos: respuestaEquipos.equipos,
            categorias: respuestaCategorias.categorias,
          }),
        );

        setCatalogosCargados(true);
        setErrorCatalogos("");
      } catch (error) {
        if (!activo) {
          return;
        }

        setErrorCatalogos(
          error.response?.data?.message ||
            "No se pudieron cargar los equipos y las categorías.",
        );
      }
    };

    cargarCatalogos();

    return () => {
      activo = false;
    };
  }, [dispatch]);

  // Consultar únicamente la página y el filtro seleccionados.
  useEffect(() => {
    let activo = true;

    const cargarPagina = async () => {
      setCargandoPartidos(true);
      setErrorPartidos("");

      try {
        const respuesta = await obtenerPartidosApi({
          pagina: paginaSolicitada,
          limite: LIMITE_POR_PAGINA,
          category: filtroCategoria,
        });

        if (
          !Array.isArray(respuesta?.partidos) ||
          typeof respuesta.total !== "number"
        ) {
          throw new Error("La API devolvió partidos inválidos.");
        }

        if (!activo) {
          return;
        }

        dispatch(
          cargarPartidosSlice({
            partidos: respuesta.partidos,
            total: respuesta.total,
            pagina: respuesta.pagina ?? paginaSolicitada,
            limite: respuesta.limite ?? LIMITE_POR_PAGINA,
            filtroCategoria,
          }),
        );

        setDatosCargados(true);
      } catch (error) {
        if (!activo) {
          return;
        }

        if (error.response?.status === 401) {
          setErrorPartidos("La sesión fue rechazada. Volvé a iniciar sesión.");
        } else {
          setErrorPartidos(
            error.response?.data?.message ||
              "No se pudo cargar la página de partidos.",
          );
        }
      } finally {
        if (activo) {
          setCargandoPartidos(false);
        }
      }
    };

    cargarPagina();

    return () => {
      activo = false;
    };
  }, [dispatch, paginaSolicitada, filtroCategoria]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(totalFiltrado / (limite || LIMITE_POR_PAGINA)),
  );

  // Si una eliminación deja vacía la última página,
  // nos desplazamos a la anterior.
  useEffect(() => {
    if (datosCargados && paginaSolicitada > totalPaginas) {
      setPaginaSolicitada(totalPaginas);
    }
  }, [datosCargados, paginaSolicitada, totalPaginas]);

  const partidoCreado = () => {
    setErrorAccion("");
  };

  const partidoActualizado = () => {
    setIdPartidoEditando(null);
    setErrorAccion("");
  };

  const seleccionarPartidoEditar = (idPartido) => {
    setIdPartidoEditando((anterior) =>
      anterior === idPartido ? null : idPartido,
    );
  };

  const cambiarFiltro = (evento) => {
    setFiltroCategoria(evento.target.value);
    setPaginaSolicitada(1);
    setIdPartidoEditando(null);
    setErrorAccion("");
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas || cargandoPartidos) {
      return;
    }

    setPaginaSolicitada(nuevaPagina);
    setIdPartidoEditando(null);
    setErrorAccion("");
  };

  const eliminarPartido = async (idPartido) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que querés eliminar este partido?",
    );

    if (!confirmar) {
      return;
    }

    setErrorAccion("");
    setEliminando(true);

    try {
      await eliminarPartidoApi(idPartido);

      dispatch(eliminarPartidoSlice(idPartido));

      if (idPartidoEditando === idPartido) {
        setIdPartidoEditando(null);
      }
    } catch (error) {
      setErrorAccion(
        error.response?.data?.message || "No se pudo eliminar el partido.",
      );
    } finally {
      setEliminando(false);
    }
  };

  const planCambiado = (usuarioActualizado) => {
    if (!usuarioActualizado) {
      setErrorAccion(
        "El backend no devolvió los datos del usuario actualizado.",
      );
      return;
    }

    const nuevosDatosUsuario = {
      ...usuario,
      ...usuarioActualizado,
    };

    localStorage.setItem("usuario", JSON.stringify(nuevosDatosUsuario));

    dispatch(actualizarUsuarioSlice(nuevosDatosUsuario));
    setErrorAccion("");
  };

  const limiteAlcanzado =
    usuario?.plan?.toLowerCase() === "plus" &&
    datosCargados &&
    totalPartidos >= 4;

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    dispatch(limpiarPartidosSlice());
    dispatch(limpiarCatalogosSlice());
    dispatch(limpiarJugadoresSlice());
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

      {datosCargados && <InformeUso />}

      {usuario.role !== "admin" && (
        <CambioPlan plan={usuario.plan} onPlanCambiado={planCambiado} />
      )}

      {errorCatalogos && <p className="error">{errorCatalogos}</p>}

      {errorAccion && <p className="error">{errorAccion}</p>}

      <h3>Crear partido</h3>

      {limiteAlcanzado && (
        <p>
          Alcanzaste el límite de 4 partidos de tu plan Plus. Para crear más
          partidos, cambiá a Premium o eliminá alguno de los existentes.
        </p>
      )}

      {datosCargados && catalogosCargados && (
        <fieldset
          disabled={limiteAlcanzado || cargandoPartidos}
          style={{
            border: "none",
            margin: 0,
            padding: 0,
            minWidth: 0,
          }}
        >
          <CrearPartido
            onPartidoCreado={partidoCreado}
            onVolver={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          />
        </fieldset>
      )}

      <h3>Mis partidos</h3>

      <div className="campo">
        <label htmlFor="filtroCategoria">Filtrar por categoría</label>

        <select
          id="filtroCategoria"
          value={filtroCategoria}
          onChange={cambiarFiltro}
          disabled={!catalogosCargados}
        >
          <option value="">Todas las categorías</option>

          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.name}
            </option>
          ))}
        </select>
      </div>

      {datosCargados && (
        <>
          <p>
            <strong>Total de partidos:</strong> {totalPartidos}
          </p>

          {filtroCategoria && (
            <p>
              <strong>Partidos de la categoría seleccionada:</strong>{" "}
              {totalFiltrado}
            </p>
          )}
        </>
      )}

      {cargandoPartidos && <p>Cargando partidos...</p>}

      {errorPartidos && <p className="error">{errorPartidos}</p>}

      {!cargandoPartidos && !errorPartidos && datosCargados && (
        <>
          {partidos.length === 0 ? (
            <p>No hay partidos para mostrar con el filtro seleccionado.</p>
          ) : (
            <div>
              {partidos.map((partido) => {
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

                    <ResumenPartido idPartido={partido.id} />

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

          {totalFiltrado > 0 && (
            <div
              style={{
                marginTop: "15px",
                marginBottom: "20px",
              }}
            >
              <p>
                Página {paginaActual} de {totalPaginas}
                {" — "}
                {partidos.length} partidos mostrados
              </p>

              {totalPaginas > 1 && (
                <div>
                  <button
                    type="button"
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual <= 1 || cargandoPartidos}
                  >
                    Anterior
                  </button>

                  <button
                    type="button"
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual >= totalPaginas || cargandoPartidos}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {datosCargados && !cargandoPartidos && (
        <>
          <p>
            <small>El gráfico muestra los partidos de la página actual.</small>
          </p>

          <GraficoPartidos />
        </>
      )}

      <button type="button" onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Dashboard;
