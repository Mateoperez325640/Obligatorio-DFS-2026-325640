import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  obtenerCategoriasApi,
  crearCategoriaApi,
  editarCategoriaApi,
  eliminarCategoriaApi,
} from "../services/catalogosServices.js";

const esquemaCategoria = Yup.object({
  name: Yup.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .required("El nombre es obligatorio"),
});

function GestionCategorias() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarCategorias = async () => {
    try {
      const respuesta = await obtenerCategoriasApi();
      setCategorias(respuesta.categorias);
    } catch (error) {
      setError("No se pudieron cargar las categorías.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: categoriaEditando?.name || "",
    },

    validationSchema: esquemaCategoria,

    onSubmit: async (valores) => {
      setError("");
      setMensaje("");

      try {
        if (categoriaEditando) {
          await editarCategoriaApi(categoriaEditando.id, valores);
          setMensaje("Categoría actualizada correctamente.");
        } else {
          await crearCategoriaApi(valores);
          setMensaje("Categoría creada correctamente.");
        }

        setCategoriaEditando(null);
        formik.resetForm();

        await cargarCategorias();
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
    formik.resetForm();
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

      if (categoriaEditando?.id === idCategoria) {
        setCategoriaEditando(null);
        formik.resetForm();
      }

      setMensaje("Categoría eliminada correctamente.");

      await cargarCategorias();
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
          <label htmlFor="name">Nombre de la categoría</label>

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

      <button type="button" onClick={() => navigate("/admin")}>
        Volver al panel de administración
      </button>
    </div>
  );
}

export default GestionCategorias;
