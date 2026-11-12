import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  obtenerCategoriasApi,
  crearCategoriaApi,
  editarCategoriaApi,
  eliminarCategoriaApi,
} from "../services/catalogosServices.js";
import {
  cargarCategoriasSlice,
  agregarCategoriaSlice,
  actualizarCategoriaSlice,
  eliminarCategoriaSlice,
} from "../redux/features/catalogosSlice.js";

const esquemaCategoria = Yup.object({
  name: Yup.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .required("El nombre es obligatorio"),
});

function GestionCategorias() {
  const dispatch = useDispatch();

  const categorias = useSelector((state) => state.catalogos.categorias);

  const categoriasCargadas = useSelector(
    (state) => state.catalogos.categoriasCargadas,
  );

  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [cargando, setCargando] = useState(!categoriasCargadas);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (categoriasCargadas) {
      setCargando(false);
      return;
    }

    let activo = true;

    const cargarCategorias = async () => {
      try {
        const respuesta = await obtenerCategoriasApi();

        if (!Array.isArray(respuesta?.categorias)) {
          throw new Error("La API devolvió categorías inválidas.");
        }

        if (activo) {
          dispatch(cargarCategoriasSlice(respuesta.categorias));
        }
      } catch (error) {
        if (activo) {
          setError("No se pudieron cargar las categorías.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarCategorias();

    return () => {
      activo = false;
    };
  }, [dispatch, categoriasCargadas]);

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: categoriaEditando?.name || "",
    },

    validationSchema: esquemaCategoria,

    onSubmit: async (valores, { resetForm }) => {
      setError("");
      setMensaje("");

      try {
        if (categoriaEditando) {
          const respuesta = await editarCategoriaApi(
            categoriaEditando.id,
            valores,
          );

          const categoriaActualizada = respuesta?.categoria;

          if (
            !categoriaActualizada?.id ||
            categoriaActualizada.id !== categoriaEditando.id
          ) {
            setError(
              "El servidor no devolvió la categoría actualizada. " +
                "Actualizá la página para verificar los cambios.",
            );
            return;
          }

          dispatch(actualizarCategoriaSlice(categoriaActualizada));

          setMensaje("Categoría actualizada correctamente.");
        } else {
          const respuesta = await crearCategoriaApi(valores);
          const categoriaCreada = respuesta?.categoria;

          if (!categoriaCreada?.id) {
            setError(
              "El servidor no devolvió la categoría creada. " +
                "Actualizá la página antes de intentar nuevamente.",
            );
            return;
          }

          dispatch(agregarCategoriaSlice(categoriaCreada));

          setMensaje("Categoría creada correctamente.");
        }

        setCategoriaEditando(null);
        resetForm({ values: { name: "" } });
      } catch (error) {
        setError(
          error.response?.data?.errors?.[0] ||
            error.response?.data?.message ||
            "No se pudo guardar la categoría.",
        );
      }
    },
  });

  const seleccionarCategoria = (categoria) => {
    setError("");
    setMensaje("");
    setCategoriaEditando(categoria);
  };

  const cancelarEdicion = () => {
    setCategoriaEditando(null);
    setError("");
    setMensaje("");
    formik.resetForm({ values: { name: "" } });
  };

  const eliminarCategoria = async (idCategoria) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que querés eliminar esta categoría?",
    );

    if (!confirmar) {
      return;
    }

    setError("");
    setMensaje("");
    setEliminando(true);

    try {
      await eliminarCategoriaApi(idCategoria);

      dispatch(eliminarCategoriaSlice(idCategoria));

      if (categoriaEditando?.id === idCategoria) {
        setCategoriaEditando(null);
        formik.resetForm({ values: { name: "" } });
      }

      setMensaje("Categoría eliminada correctamente.");
    } catch (error) {
      setError(
        error.response?.data?.message || "No se pudo eliminar la categoría.",
      );
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="login">
      <h2>Gestión de categorías</h2>

      <h3>{categoriaEditando ? "Editar categoría" : "Crear categoría"}</h3>

      <form onSubmit={formik.handleSubmit} noValidate>
        <div className="campo">
          <label htmlFor="nombreCategoria">Nombre de la categoría</label>

          <input
            type="text"
            id="nombreCategoria"
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
            : categoriaEditando
              ? "Guardar cambios"
              : "Crear categoría"}
        </button>

        {categoriaEditando && (
          <button type="button" onClick={cancelarEdicion}>
            Cancelar edición
          </button>
        )}
      </form>

      <h3>Categorías registradas</h3>

      {cargando ? (
        <p>Cargando categorías...</p>
      ) : categorias.length === 0 ? (
        <p>No hay categorías registradas.</p>
      ) : (
        <div>
          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "12px",
              }}
            >
              <p>
                <strong>{categoria.name}</strong>
              </p>

              <button
                type="button"
                onClick={() => seleccionarCategoria(categoria)}
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => eliminarCategoria(categoria.id)}
                disabled={eliminando}
              >
                {eliminando ? "Procesando..." : "Eliminar"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GestionCategorias;
