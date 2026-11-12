import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { obtenerEquiposApi } from "../services/catalogosServices.js";
import { subirImagenApi } from "../services/imagenesServices.js";
import {
  obtenerJugadoresApi,
  crearJugadorApi,
  editarJugadorApi,
  eliminarJugadorApi,
} from "../services/jugadoresServices.js";
import { cargarEquiposSlice } from "../redux/features/catalogosSlice.js";
import {
  cargarJugadoresSlice,
  agregarJugadorSlice,
  actualizarJugadorSlice,
  eliminarJugadorSlice,
} from "../redux/features/jugadoresSlice.js";

const esquemaJugador = Yup.object({
  name: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres")
    .required("El nombre es obligatorio"),

  team: Yup.string().required("Seleccioná un equipo"),
});

function GestionJugadores() {
  const dispatch = useDispatch();

  const jugadores = useSelector((state) => state.jugadores.lista);
  const jugadoresCargados = useSelector((state) => state.jugadores.cargados);

  const equipos = useSelector((state) => state.catalogos.equipos);
  const equiposCargados = useSelector(
    (state) => state.catalogos.equiposCargados,
  );

  const [jugadorEditando, setJugadorEditando] = useState(null);
  const [cargando, setCargando] = useState(!jugadoresCargados);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [imagenBase64, setImagenBase64] = useState("");
  const [vistaPrevia, setVistaPrevia] = useState("");
  const [leyendoImagen, setLeyendoImagen] = useState(false);
  const [claveImagen, setClaveImagen] = useState(0);

  useEffect(() => {
    if (jugadoresCargados) {
      setCargando(false);
      return;
    }

    let activo = true;

    const cargarJugadores = async () => {
      try {
        const respuesta = await obtenerJugadoresApi();

        if (!Array.isArray(respuesta?.jugadores)) {
          throw new Error("La API devolvió jugadores inválidos.");
        }

        if (activo) {
          dispatch(cargarJugadoresSlice(respuesta.jugadores));
        }
      } catch (error) {
        if (activo) {
          setError("No se pudieron cargar los jugadores.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarJugadores();

    return () => {
      activo = false;
    };
  }, [dispatch, jugadoresCargados]);

  useEffect(() => {
    if (equiposCargados) {
      return;
    }

    let activo = true;

    const cargarEquipos = async () => {
      try {
        const respuesta = await obtenerEquiposApi();

        if (!Array.isArray(respuesta?.equipos)) {
          throw new Error("La API devolvió equipos inválidos.");
        }

        if (activo) {
          dispatch(cargarEquiposSlice(respuesta.equipos));
        }
      } catch (error) {
        if (activo) {
          setError("No se pudieron cargar los equipos.");
        }
      }
    };

    cargarEquipos();

    return () => {
      activo = false;
    };
  }, [dispatch, equiposCargados]);

  const limpiarImagen = (imagenAnterior = "") => {
    setImagenBase64("");
    setVistaPrevia(imagenAnterior);
    setLeyendoImagen(false);
    setClaveImagen((anterior) => anterior + 1);
  };

  const seleccionarImagen = (event) => {
    const archivo = event.target.files?.[0];

    if (!archivo) {
      return;
    }

    setError("");
    setMensaje("");

    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

    if (!tiposPermitidos.includes(archivo.type)) {
      setError("Seleccioná una imagen JPG, PNG o WebP.");
      limpiarImagen(jugadorEditando?.image || "");
      return;
    }

    if (archivo.size > 3 * 1024 * 1024) {
      setError("La imagen no puede superar los 3 MB.");
      limpiarImagen(jugadorEditando?.image || "");
      return;
    }

    setLeyendoImagen(true);
    setImagenBase64("");

    const lector = new FileReader();

    lector.onload = () => {
      if (typeof lector.result === "string") {
        setImagenBase64(lector.result);
        setVistaPrevia(lector.result);
      } else {
        setError("No se pudo leer la imagen.");
      }

      setLeyendoImagen(false);
    };

    lector.onerror = () => {
      setError("No se pudo leer la imagen.");
      setLeyendoImagen(false);
    };

    lector.readAsDataURL(archivo);
  };

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: jugadorEditando?.name || "",
      team: jugadorEditando?.team || "",
    },

    validationSchema: esquemaJugador,

    onSubmit: async (valores, { resetForm }) => {
      setError("");
      setMensaje("");

      try {
        const datosJugador = {
          ...valores,
        };

        if (imagenBase64) {
          const respuestaImagen = await subirImagenApi(imagenBase64);

          if (!respuestaImagen?.image) {
            setError("La imagen no se pudo guardar. Intentá nuevamente.");
            return;
          }

          datosJugador.image = respuestaImagen.image;
        }

        if (jugadorEditando) {
          const respuesta = await editarJugadorApi(
            jugadorEditando.id,
            datosJugador,
          );

          const jugadorActualizado = respuesta?.jugador;

          if (
            !jugadorActualizado?.id ||
            jugadorActualizado.id !== jugadorEditando.id
          ) {
            setError(
              "El servidor no devolvió el jugador actualizado. " +
                "Actualizá la página para verificar los cambios.",
            );
            return;
          }

          dispatch(actualizarJugadorSlice(jugadorActualizado));

          setMensaje("Jugador actualizado correctamente.");
        } else {
          const respuesta = await crearJugadorApi(datosJugador);
          const jugadorCreado = respuesta?.jugador;

          if (!jugadorCreado?.id) {
            setError(
              "El servidor no devolvió el jugador creado. " +
                "Actualizá la página antes de intentar nuevamente.",
            );
            return;
          }

          dispatch(agregarJugadorSlice(jugadorCreado));

          setMensaje("Jugador creado correctamente.");
        }

        setJugadorEditando(null);
        resetForm({
          values: {
            name: "",
            team: "",
          },
        });
        limpiarImagen();
      } catch (error) {
        setError(
          error.response?.data?.errors?.[0] ||
            error.response?.data?.message ||
            "No se pudo guardar el jugador o subir su imagen.",
        );
      }
    },
  });

  const seleccionarJugador = (jugador) => {
    setError("");
    setMensaje("");
    setJugadorEditando(jugador);
    limpiarImagen(jugador.image || "");
  };

  const cancelarEdicion = () => {
    setJugadorEditando(null);
    setError("");
    setMensaje("");
    formik.resetForm({
      values: {
        name: "",
        team: "",
      },
    });
    limpiarImagen();
  };

  const eliminarJugador = async (idJugador) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que querés eliminar este jugador?",
    );

    if (!confirmar) {
      return;
    }

    setError("");
    setMensaje("");
    setEliminando(true);

    try {
      await eliminarJugadorApi(idJugador);

      dispatch(eliminarJugadorSlice(idJugador));

      if (jugadorEditando?.id === idJugador) {
        setJugadorEditando(null);
        formik.resetForm({
          values: {
            name: "",
            team: "",
          },
        });
        limpiarImagen();
      }

      setMensaje("Jugador eliminado correctamente.");
    } catch (error) {
      setError(
        error.response?.data?.message || "No se pudo eliminar el jugador.",
      );
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="admin-modulo admin-modulo-jugadores">
      <div className="admin-modulo-cabecera">
        <div>
          <span className="admin-sobretitulo admin-sobretitulo-oscuro">
            PLANTEL
          </span>
          <h2>Jugadores</h2>
          <p>Administrá los jugadores de cada equipo y sus fotografías.</p>
        </div>
        <span className="admin-contador">{jugadores.length} registros</span>
      </div>

      <div className="admin-jugadores-layout">
        <form
          className="admin-formulario admin-formulario-jugadores"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <h3>{jugadorEditando ? "Editar jugador" : "Crear jugador"}</h3>

          <div className="admin-jugador-campos">
            <div className="campo">
              <label htmlFor="nombreJugador">Nombre del jugador</label>
              <input
                type="text"
                id="nombreJugador"
                name="name"
                placeholder="Ej.: Juan Pérez"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <small className="error">{formik.errors.name}</small>
              )}
            </div>

            <div className="campo">
              <label htmlFor="equipoJugador">Equipo</label>
              <select
                id="equipoJugador"
                name="team"
                value={formik.values.team}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Seleccioná un equipo</option>
                {equipos.map((equipo) => (
                  <option key={equipo.id} value={equipo.id}>
                    {equipo.name}
                  </option>
                ))}
              </select>
              {formik.touched.team && formik.errors.team && (
                <small className="error">{formik.errors.team}</small>
              )}
            </div>
          </div>

          <div className="campo admin-campo-imagen">
            <label htmlFor="imagenJugador">Fotografía del jugador</label>
            <input
              key={claveImagen}
              type="file"
              id="imagenJugador"
              accept="image/jpeg,image/png,image/webp"
              onChange={seleccionarImagen}
            />
            <small>Formatos permitidos: JPG, PNG o WebP. Máximo 3 MB.</small>
          </div>

          {leyendoImagen && <p>Preparando imagen...</p>}

          {vistaPrevia && (
            <div className="admin-vista-previa">
              <img src={vistaPrevia} alt="Fotografía del jugador" />
              <div>
                <strong>Vista previa</strong>
                <p>Fotografía que se mostrará en el perfil del jugador.</p>
              </div>
            </div>
          )}

          {imagenBase64 && (
            <button
              type="button"
              className="admin-boton-secundario admin-cancelar-imagen"
              onClick={() => limpiarImagen(jugadorEditando?.image || "")}
            >
              Cancelar imagen seleccionada
            </button>
          )}

          {mensaje && (
            <p className="mensaje-exito" role="status">
              {mensaje}
            </p>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <div className="admin-formulario-acciones">
            <button
              type="submit"
              disabled={
                (!formik.dirty && !imagenBase64) ||
                !formik.isValid ||
                formik.isSubmitting ||
                leyendoImagen ||
                equipos.length === 0
              }
            >
              {formik.isSubmitting
                ? "Guardando..."
                : jugadorEditando
                  ? "Guardar cambios"
                  : "Crear jugador"}
            </button>

            {jugadorEditando && (
              <button
                type="button"
                className="admin-boton-secundario"
                onClick={cancelarEdicion}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>

        <div className="admin-panel-jugadores-listado">
          <div className="admin-listado-cabecera">
            <h3>Jugadores registrados</h3>
            <span>{jugadores.length} en total</span>
          </div>

          {cargando ? (
            <p className="admin-estado">Cargando jugadores...</p>
          ) : jugadores.length === 0 ? (
            <p className="admin-estado">No hay jugadores registrados.</p>
          ) : (
            <div className="admin-lista admin-lista-jugadores">
              {jugadores.map((jugador) => {
                const equipoJugador = equipos.find(
                  (equipo) => equipo.id === jugador.team,
                );

                return (
                  <article
                    key={jugador.id}
                    className="admin-registro admin-registro-jugador"
                  >
                    {jugador.image ? (
                      <img
                        className="admin-jugador-foto"
                        src={jugador.image}
                        alt={`Fotografía de ${jugador.name}`}
                      />
                    ) : (
                      <div
                        className="admin-jugador-sin-foto"
                        aria-hidden="true"
                      >
                        {jugador.name?.charAt(0)?.toUpperCase() || "J"}
                      </div>
                    )}
                    <div className="admin-registro-info">
                      <strong>{jugador.name}</strong>
                      <span>Equipo: {equipoJugador?.name || "Sin equipo"}</span>
                    </div>
                    <div className="admin-registro-acciones">
                      <button
                        type="button"
                        className="admin-boton-editar"
                        onClick={() => seleccionarJugador(jugador)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="admin-boton-eliminar"
                        onClick={() => eliminarJugador(jugador.id)}
                        disabled={eliminando}
                      >
                        {eliminando ? "Procesando..." : "Eliminar"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GestionJugadores;
