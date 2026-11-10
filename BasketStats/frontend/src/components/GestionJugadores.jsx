import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { obtenerEquiposApi } from "../services/catalogosServices.js";
import {
  obtenerJugadoresApi,
  crearJugadorApi,
  editarJugadorApi,
  eliminarJugadorApi,
} from "../services/jugadoresServices.js";

const esquemaJugador = Yup.object({
  name: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres")
    .required("El nombre es obligatorio"),

  team: Yup.string().required("Seleccioná un equipo"),
});

function GestionJugadores() {
  const navigate = useNavigate();

  const [jugadores, setJugadores] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [jugadorEditando, setJugadorEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarDatos = async () => {
    try {
      const respuestaJugadores = await obtenerJugadoresApi();
      const respuestaEquipos = await obtenerEquiposApi();

      setJugadores(respuestaJugadores.jugadores);
      setEquipos(respuestaEquipos.equipos);
    } catch (error) {
      setError("No se pudieron cargar los jugadores y equipos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: jugadorEditando?.name || "",
      team: jugadorEditando?.team || "",
    },

    validationSchema: esquemaJugador,

    onSubmit: async (valores) => {
      setError("");
      setMensaje("");

      try {
        if (jugadorEditando) {
          await editarJugadorApi(jugadorEditando.id, valores);
          setMensaje("Jugador actualizado correctamente.");
        } else {
          await crearJugadorApi(valores);
          setMensaje("Jugador creado correctamente.");
        }

        setJugadorEditando(null);
        formik.resetForm();

        await cargarDatos();
      } catch (error) {
        setError(
          error.response?.data?.errors?.[0] ||
            error.response?.data?.message ||
            "No se pudo guardar el jugador.",
        );
      }
    },
  });

  const seleccionarJugador = (jugador) => {
    setError("");
    setMensaje("");
    setJugadorEditando(jugador);
  };

  const cancelarEdicion = () => {
    setJugadorEditando(null);
    setError("");
    setMensaje("");
    formik.resetForm();
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

      if (jugadorEditando?.id === idJugador) {
        setJugadorEditando(null);
        formik.resetForm();
      }

      setMensaje("Jugador eliminado correctamente.");

      await cargarDatos();
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
          <label htmlFor="name">Nombre del jugador</label>
          <input
            type="text"
            id="name"
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
          <label htmlFor="team">Equipo</label>
          <select
            id="team"
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

        {mensaje && <p className="mensaje-exito">{mensaje}</p>}
        {error && <p className="error">{error}</p>}

        <button
          type="submit"
          disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
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

      <button type="button" onClick={() => navigate("/admin")}>
        Volver al panel de administración
      </button>
    </div>
  );
}

export default GestionJugadores;
