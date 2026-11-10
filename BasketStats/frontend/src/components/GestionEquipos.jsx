import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  obtenerEquiposApi,
  crearEquipoApi,
  editarEquipoApi,
  eliminarEquipoApi,
} from "../services/catalogosServices.js";

const esquemaEquipo = Yup.object({
  name: Yup.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .required("El nombre es obligatorio"),
});

function GestionEquipos() {
  const navigate = useNavigate();

  const [equipos, setEquipos] = useState([]);
  const [equipoEditando, setEquipoEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarEquipos = async () => {
    try {
      const respuesta = await obtenerEquiposApi();
      setEquipos(respuesta.equipos);
    } catch (error) {
      setError("No se pudieron cargar los equipos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEquipos();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: equipoEditando?.name || "",
    },

    validationSchema: esquemaEquipo,

    onSubmit: async (valores) => {
      setError("");
      setMensaje("");

      try {
        if (equipoEditando) {
          await editarEquipoApi(equipoEditando.id, valores);
          setMensaje("Equipo actualizado correctamente.");
        } else {
          await crearEquipoApi(valores);
          setMensaje("Equipo creado correctamente.");
        }

        setEquipoEditando(null);
        formik.resetForm();

        await cargarEquipos();
      } catch (error) {
        setError(
          error.response?.data?.errors?.[0] ||
            error.response?.data?.message ||
            "No se pudo guardar el equipo.",
        );
      }
    },
  });

  const seleccionarEquipo = (equipo) => {
    setError("");
    setMensaje("");
    setEquipoEditando(equipo);
  };

  const cancelarEdicion = () => {
    setEquipoEditando(null);
    setError("");
    setMensaje("");
    formik.resetForm();
  };

  const eliminarEquipo = async (idEquipo) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que querés eliminar este equipo?",
    );

    if (!confirmar) {
      return;
    }

    setError("");
    setMensaje("");
    setEliminando(true);

    try {
      await eliminarEquipoApi(idEquipo);

      if (equipoEditando?.id === idEquipo) {
        setEquipoEditando(null);
        formik.resetForm();
      }

      setMensaje("Equipo eliminado correctamente.");

      await cargarEquipos();
    } catch (error) {
      setError(
        error.response?.data?.message || "No se pudo eliminar el equipo.",
      );
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="login">
      <h2>Gestión de equipos</h2>

      <h3>{equipoEditando ? "Editar equipo" : "Crear equipo"}</h3>

      <form onSubmit={formik.handleSubmit} noValidate>
        <div className="campo">
          <label htmlFor="name">Nombre del equipo</label>

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

        {mensaje && <p className="mensaje-exito">{mensaje}</p>}

        {error && <p className="error">{error}</p>}

        <button
          type="submit"
          disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
        >
          {formik.isSubmitting
            ? "Guardando..."
            : equipoEditando
              ? "Guardar cambios"
              : "Crear equipo"}
        </button>

        {equipoEditando && (
          <button type="button" onClick={cancelarEdicion}>
            Cancelar edición
          </button>
        )}
      </form>

      <h3>Equipos registrados</h3>

      {cargando ? (
        <p>Cargando equipos...</p>
      ) : equipos.length === 0 ? (
        <p>No hay equipos registrados.</p>
      ) : (
        <div>
          {equipos.map((equipo) => (
            <div
              key={equipo.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "12px",
              }}
            >
              <p>
                <strong>{equipo.name}</strong>
              </p>

              <button type="button" onClick={() => seleccionarEquipo(equipo)}>
                Editar
              </button>

              <button
                type="button"
                onClick={() => eliminarEquipo(equipo.id)}
                disabled={eliminando}
              >
                {eliminando ? "Procesando..." : "Eliminar"}
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="button" onClick={() => navigate("/admin")}>
        Volver al panel de administración
      </button>
    </div>
  );
}

export default GestionEquipos;
