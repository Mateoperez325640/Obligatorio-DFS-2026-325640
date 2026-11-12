import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  obtenerEquiposApi,
  crearEquipoApi,
  editarEquipoApi,
  eliminarEquipoApi,
} from "../services/catalogosServices.js";
import {
  cargarEquiposSlice,
  agregarEquipoSlice,
  actualizarEquipoSlice,
  eliminarEquipoSlice,
} from "../redux/features/catalogosSlice.js";

const esquemaEquipo = Yup.object({
  name: Yup.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .required("El nombre es obligatorio"),
});

function GestionEquipos() {
  const dispatch = useDispatch();

  const equipos = useSelector((state) => state.catalogos.equipos);
  const equiposCargados = useSelector(
    (state) => state.catalogos.equiposCargados,
  );

  const [equipoEditando, setEquipoEditando] = useState(null);
  const [cargando, setCargando] = useState(!equiposCargados);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (equiposCargados) {
      setCargando(false);
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
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarEquipos();

    return () => {
      activo = false;
    };
  }, [dispatch, equiposCargados]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: equipoEditando?.name || "",
    },
    validationSchema: esquemaEquipo,
    onSubmit: async (valores, { resetForm }) => {
      setError("");
      setMensaje("");

      try {
        if (equipoEditando) {
          const respuesta = await editarEquipoApi(equipoEditando.id, valores);
          const equipoActualizado = respuesta?.equipo;

          if (
            !equipoActualizado?.id ||
            equipoActualizado.id !== equipoEditando.id
          ) {
            setError(
              "El servidor no devolvió el equipo actualizado. " +
                "Actualizá la página para verificar los cambios.",
            );
            return;
          }

          dispatch(actualizarEquipoSlice(equipoActualizado));
          setMensaje("Equipo actualizado correctamente.");
        } else {
          const respuesta = await crearEquipoApi(valores);
          const equipoCreado = respuesta?.equipo;

          if (!equipoCreado?.id) {
            setError(
              "El servidor no devolvió el equipo creado. " +
                "Actualizá la página antes de intentar nuevamente.",
            );
            return;
          }

          dispatch(agregarEquipoSlice(equipoCreado));
          setMensaje("Equipo creado correctamente.");
        }

        setEquipoEditando(null);
        resetForm({ values: { name: "" } });
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
    formik.resetForm({ values: { name: "" } });
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
      dispatch(eliminarEquipoSlice(idEquipo));

      if (equipoEditando?.id === idEquipo) {
        setEquipoEditando(null);
        formik.resetForm({ values: { name: "" } });
      }

      setMensaje("Equipo eliminado correctamente.");
    } catch (error) {
      setError(
        error.response?.data?.message || "No se pudo eliminar el equipo.",
      );
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="admin-modulo">
      <div className="admin-modulo-cabecera">
        <div>
          <span className="admin-sobretitulo admin-sobretitulo-oscuro">
            CATÁLOGO
          </span>
          <h2>Equipos</h2>
          <p>Gestioná los clubes disponibles en BasketStats.</p>
        </div>
        <span className="admin-contador">{equipos.length} registros</span>
      </div>

      <form
        className="admin-formulario"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <h3>{equipoEditando ? "Editar equipo" : "Crear equipo"}</h3>
        <div className="campo">
          <label htmlFor="name">Nombre del equipo</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Ej.: Club Atlético Peñarol"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <small className="error">{formik.errors.name}</small>
          )}
        </div>

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
            disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
          >
            {formik.isSubmitting
              ? "Guardando..."
              : equipoEditando
                ? "Guardar cambios"
                : "Crear equipo"}
          </button>
          {equipoEditando && (
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

      <div className="admin-listado-cabecera">
        <h3>Equipos registrados</h3>
        <span>{equipos.length} en total</span>
      </div>

      {cargando ? (
        <p className="admin-estado">Cargando equipos...</p>
      ) : equipos.length === 0 ? (
        <p className="admin-estado">No hay equipos registrados.</p>
      ) : (
        <div className="admin-lista">
          {equipos.map((equipo) => (
            <article key={equipo.id} className="admin-registro">
              <div className="admin-registro-info">
                <span className="admin-registro-tipo">EQUIPO</span>
                <strong>{equipo.name}</strong>
              </div>
              <div className="admin-registro-acciones">
                <button
                  type="button"
                  className="admin-boton-editar"
                  onClick={() => seleccionarEquipo(equipo)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="admin-boton-eliminar"
                  onClick={() => eliminarEquipo(equipo.id)}
                  disabled={eliminando}
                >
                  {eliminando ? "Procesando..." : "Eliminar"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default GestionEquipos;
