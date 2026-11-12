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
    <main className="login dashboard">
      {/* Encabezado con acciones siempre accesibles */}
      <header className="dashboard-hero">
        <div className="dashboard-hero-principal">
          <span className="dashboard-sobretitulo">
            BASKETSTATS · PANEL PERSONAL
          </span>
          <h2>Mi panel</h2>
          <p>
            Bienvenido, {usuario.name}. Gestioná tus partidos y estadísticas.
          </p>
          <div className="dashboard-usuario-datos">
            <span>
              Usuario: <strong>{usuario.username}</strong>
            </span>
            <span>
              Rol: <strong>{usuario.role}</strong>
            </span>
          </div>
        </div>
        <div className="dashboard-hero-acciones">
          {usuario.role === "admin" && (
            <button
              type="button"
              className="btn-panel-admin"
              onClick={() => navigate("/admin")}
            >
              Panel de administración
            </button>
          )}
          <button
            type="button"
            className="btn-cerrar-sesion"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Indicadores rápidos */}
      <section
        className="dashboard-indicadores"
        aria-label="Resumen de la cuenta"
      >
        <div className="dashboard-indicador">
          <span className="indicador-etiqueta">Partidos registrados</span>
          <strong className="indicador-valor">
            {datosCargados ? totalPartidos : "—"}
          </strong>
          <span className="indicador-detalle">En tu cuenta</span>
        </div>
        <div className="dashboard-indicador">
          <span className="indicador-etiqueta">Plan actual</span>
          <strong className="indicador-valor indicador-valor-texto">
            {usuario.plan?.toLowerCase() === "premium"
              ? "Premium"
              : usuario.plan || "Sin plan"}
          </strong>
          <span className="indicador-detalle">
            {usuario.plan?.toLowerCase() === "plus"
              ? "Hasta 4 partidos"
              : "Gestión de partidos"}
          </span>
        </div>
        <div className="dashboard-indicador">
          <span className="indicador-etiqueta">Partidos del filtro</span>
          <strong className="indicador-valor">
            {datosCargados ? totalFiltrado : "—"}
          </strong>
          <span className="indicador-detalle">
            {filtroCategoria
              ? "Categoría seleccionada"
              : "Todas las categorías"}
          </span>
        </div>
      </section>

      {(errorCatalogos || errorAccion) && (
        <div className="dashboard-alertas" role="alert">
          {errorCatalogos && <p className="error">{errorCatalogos}</p>}
          {errorAccion && <p className="error">{errorAccion}</p>}
        </div>
      )}

      {/* Uso y plan: dos tarjetas, sin separar las funcionalidades */}
      <div className="dashboard-paneles-superiores">
        <section className="dashboard-tarjeta dashboard-tarjeta-uso">
          <span className="dashboard-sobretitulo dashboard-sobretitulo-claro">
            TU ACTIVIDAD
          </span>
          {datosCargados ? <InformeUso /> : <p>Cargando informe de uso...</p>}
        </section>
        <section className="dashboard-tarjeta dashboard-tarjeta-plan">
          <span className="dashboard-sobretitulo dashboard-sobretitulo-claro">
            TU SUSCRIPCIÓN
          </span>
          {usuario.role !== "admin" ? (
            <CambioPlan plan={usuario.plan} onPlanCambiado={planCambiado} />
          ) : (
            <div className="dashboard-info-admin">
              <h3>Administración</h3>
              <p>
                Gestioná equipos, categorías y jugadores desde el panel de
                administración.
              </p>
              <button type="button" onClick={() => navigate("/admin")}>
                Ir al panel administrador
              </button>
            </div>
          )}
        </section>
      </div>

      {/* El formulario permanece visible, como requiere la consigna */}
      <section
        className="dashboard-seccion dashboard-seccion-crear"
        aria-label="Crear partido"
      >
        <div className="dashboard-seccion-cabecera">
          <div>
            <span className="dashboard-sobretitulo dashboard-sobretitulo-claro">
              NUEVO ENCUENTRO
            </span>
            <h3>Registrar un partido</h3>
          </div>
          <p>Completá los datos para agregar un resultado a BasketStats.</p>
        </div>

        {limiteAlcanzado && (
          <p className="dashboard-aviso-limite">
            Alcanzaste el límite de 4 partidos de tu plan Plus. Para crear más
            partidos, cambiá a Premium o eliminá alguno de los existentes.
          </p>
        )}

        {datosCargados && catalogosCargados ? (
          <fieldset
            disabled={limiteAlcanzado || cargandoPartidos}
            className="dashboard-formulario"
          >
            <CrearPartido
              onPartidoCreado={partidoCreado}
              onVolver={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />
          </fieldset>
        ) : (
          <p>Preparando el formulario...</p>
        )}
      </section>

      {/* Todos los partidos de la página actual, con edición e IA integradas */}
      <section
        className="dashboard-seccion dashboard-seccion-partidos"
        aria-label="Mis partidos"
      >
        <div className="dashboard-seccion-cabecera">
          <div>
            <span className="dashboard-sobretitulo dashboard-sobretitulo-claro">
              HISTORIAL
            </span>
            <h3>Mis partidos</h3>
          </div>
          <p>
            {datosCargados
              ? `${totalPartidos} registrados en total`
              : "Consultando partidos..."}
          </p>
        </div>

        <div className="dashboard-filtros">
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
            <p className="dashboard-filtros-info">
              {filtroCategoria
                ? `${totalFiltrado} partidos en esta categoría`
                : `${totalPartidos} partidos registrados`}
            </p>
          )}
        </div>

        {cargandoPartidos && (
          <p className="dashboard-mensaje">Cargando partidos...</p>
        )}
        {errorPartidos && (
          <p className="error" role="alert">
            {errorPartidos}
          </p>
        )}

        {!cargandoPartidos && !errorPartidos && datosCargados && (
          <>
            {partidos.length === 0 ? (
              <p className="dashboard-mensaje">
                No hay partidos para mostrar con el filtro seleccionado.
              </p>
            ) : (
              <div className="dashboard-partidos-grid">
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
                  const editando = idPartidoEditando === partido.id;

                  return (
                    <article
                      key={partido.id}
                      className={`dashboard-partido-card${editando ? " dashboard-partido-card-editando" : ""}`}
                    >
                      <div className="partido-cabecera">
                        <span className="partido-categoria">
                          {categoriaPartido?.name || "Sin categoría"}
                        </span>
                        <span className="partido-fecha">
                          {new Date(partido.date).toLocaleDateString("es-UY", {
                            timeZone: "UTC",
                          })}
                        </span>
                      </div>

                      <div className="partido-marcador">
                        <div className="partido-equipo">
                          <span>LOCAL</span>
                          <strong>{equipoLocal?.name || "Equipo local"}</strong>
                        </div>
                        <div className="partido-resultado">
                          <strong>
                            {partido.localScore} <span>:</span>{" "}
                            {partido.visitorScore}
                          </strong>
                          <small>Resultado</small>
                        </div>
                        <div className="partido-equipo partido-equipo-visitante">
                          <span>VISITANTE</span>
                          <strong>
                            {equipoVisitante?.name || "Equipo visitante"}
                          </strong>
                        </div>
                      </div>

                      <ResumenPartido idPartido={partido.id} />

                      <div className="partido-acciones">
                        <button
                          type="button"
                          className="btn-editar-partido"
                          onClick={() => seleccionarPartidoEditar(partido.id)}
                        >
                          {editando ? "Ocultar edición" : "Editar partido"}
                        </button>
                        <button
                          type="button"
                          className="btn-eliminar-partido"
                          onClick={() => eliminarPartido(partido.id)}
                          disabled={eliminando}
                        >
                          {eliminando ? "Procesando..." : "Eliminar partido"}
                        </button>
                      </div>

                      {editando && (
                        <div className="partido-edicion">
                          <EditarPartido
                            idPartido={partido.id}
                            onPartidoActualizado={partidoActualizado}
                            onVolver={() => setIdPartidoEditando(null)}
                          />
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}

            {totalFiltrado > 0 && (
              <nav
                className="dashboard-paginacion"
                aria-label="Paginación de partidos"
              >
                <p>
                  Página <strong>{paginaActual}</strong> de{" "}
                  <strong>{totalPaginas}</strong>
                  <span className="dashboard-paginacion-detalle">
                    {" · "}
                    {partidos.length} partidos mostrados
                  </span>
                </p>
                {totalPaginas > 1 && (
                  <div className="dashboard-paginacion-botones">
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
                      disabled={
                        paginaActual >= totalPaginas || cargandoPartidos
                      }
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </nav>
            )}
          </>
        )}
      </section>

      {/* Estadísticas integradas: el componente sigue leyendo Redux */}
      <section
        className="dashboard-seccion dashboard-seccion-grafico"
        aria-label="Estadísticas de partidos"
      >
        <div className="dashboard-seccion-cabecera">
          <div>
            <span className="dashboard-sobretitulo dashboard-sobretitulo-claro">
              ESTADÍSTICAS
            </span>
            <h3>Comparación de resultados</h3>
          </div>
          <p>Visualización de los partidos de la página actual.</p>
        </div>
        {datosCargados && !cargandoPartidos ? (
          <div className="dashboard-contenedor-grafico">
            <GraficoPartidos />
          </div>
        ) : (
          <p className="dashboard-mensaje">Preparando estadísticas...</p>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
