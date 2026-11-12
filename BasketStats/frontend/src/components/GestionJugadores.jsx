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
    <div className="login">
      <h2>Gestión de jugadores</h2>

      <h3>{jugadorEditando ? "Editar jugador" : "Crear jugador"}</h3>

      <form onSubmit={formik.handleSubmit} noValidate>
        <div className="campo">
          <label htmlFor="nombreJugador">Nombre del jugador</label>
          <input
            type="text"
            id="nombreJugador"
            name="name"
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

        <div className="campo">
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
          <div>
            <p>Vista previa:</p>

            <img
              src={vistaPrevia}
              alt="Fotografía del jugador"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        {imagenBase64 && (
          <button
            type="button"
            onClick={() => limpiarImagen(jugadorEditando?.image || "")}
          >
            Cancelar imagen seleccionada
          </button>
        )}

        {mensaje && <p className="mensaje-exito">{mensaje}</p>}
        {error && <p className="error">{error}</p>}

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
          <button type="button" onClick={cancelarEdicion}>
            Cancelar edición
          </button>
        )}
      </form>

      <h3>Jugadores registrados</h3>

      {cargando ? (
        <p>Cargando jugadores...</p>
      ) : jugadores.length === 0 ? (
        <p>No hay jugadores registrados.</p>
      ) : (
        <div>
          {jugadores.map((jugador) => {
            const equipoJugador = equipos.find(
              (equipo) => equipo.id === jugador.team,
            );

            return (
              <div
                key={jugador.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "12px",
                }}
              >
                {jugador.image && (
                  <img
                    src={jugador.image}
                    alt={`Fotografía de ${jugador.name}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                )}

                <p>
                  <strong>{jugador.name}</strong>
                </p>

                <p>Equipo: {equipoJugador?.name || "Sin equipo"}</p>

                <button
                  type="button"
                  onClick={() => seleccionarJugador(jugador)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => eliminarJugador(jugador.id)}
                  disabled={eliminando}
                >
                  {eliminando ? "Procesando..." : "Eliminar"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GestionJugadores;
