import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import {
  obtenerEquiposApi,
  obtenerCategoriasApi,
} from "../services/catalogosServices.js";
import {
  obtenerPartidosApi,
  editarPartidoApi,
} from "../services/partidosServices.js";

const esquemaPartido = Yup.object({
  localTeam: Yup.string().required("Seleccioná el equipo local"),

  visitorTeam: Yup.string()
    .required("Seleccioná el equipo visitante")
    .test(
      "equipos-diferentes",
      "El equipo visitante debe ser diferente al local",
      function (valor) {
        return valor !== this.parent.localTeam;
      },
    ),

  category: Yup.string().required("Seleccioná una categoría"),

  localScore: Yup.number()
    .integer("El puntaje debe ser entero")
    .min(0, "El puntaje no puede ser negativo")
    .required("Ingresá el puntaje local"),

  visitorScore: Yup.number()
    .integer("El puntaje debe ser entero")
    .min(0, "El puntaje no puede ser negativo")
    .required("Ingresá el puntaje visitante"),

  date: Yup.string().required("Seleccioná una fecha"),
});

function EditarPartido() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipos, setEquipos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [partido, setPartido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [errorGuardar, setErrorGuardar] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const respuestaPartidos = await obtenerPartidosApi();
        const respuestaEquipos = await obtenerEquiposApi();
        const respuestaCategorias = await obtenerCategoriasApi();

        const partidoEncontrado = respuestaPartidos.partidos.find(
          (partido) => partido.id === id,
        );

        if (!partidoEncontrado) {
          setError("No se encontró el partido.");
          return;
        }

        setPartido(partidoEncontrado);
        setEquipos(respuestaEquipos.equipos);
        setCategorias(respuestaCategorias.categorias);
      } catch (error) {
        setError("No se pudieron cargar los datos del partido.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      localTeam: partido?.localTeam || "",
      visitorTeam: partido?.visitorTeam || "",
      category: partido?.category || "",
      localScore: partido?.localScore ?? "",
      visitorScore: partido?.visitorScore ?? "",
      date: partido?.date ? partido.date.substring(0, 10) : "",
    },

    validationSchema: esquemaPartido,

    onSubmit: async (valores) => {
      setErrorGuardar("");

      try {
        const datosPartido = {
          ...valores,
          localScore: Number(valores.localScore),
          visitorScore: Number(valores.visitorScore),
        };

        await editarPartidoApi(id, datosPartido);

        navigate("/dashboard");
      } catch (error) {
        setErrorGuardar(
          error.response?.data?.errors?.[0] ||
            error.response?.data?.message ||
            "No se pudo actualizar el partido.",
        );
      }
    },
  });

  if (cargando) {
    return <p>Cargando datos del partido...</p>;
  }

  if (error) {
    return (
      <div className="login">
        <p className="error">{error}</p>
        <button onClick={() => navigate("/dashboard")}>
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="login">
      <h2>Editar partido</h2>

      <form onSubmit={formik.handleSubmit} noValidate>
        <div className="campo">
          <label htmlFor="localTeam">Equipo local</label>
          <select
            id="localTeam"
            name="localTeam"
            value={formik.values.localTeam}
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
          {formik.touched.localTeam && formik.errors.localTeam && (
            <small className="error">{formik.errors.localTeam}</small>
          )}
        </div>

        <div className="campo">
          <label htmlFor="visitorTeam">Equipo visitante</label>
          <select
            id="visitorTeam"
            name="visitorTeam"
            value={formik.values.visitorTeam}
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
          {formik.touched.visitorTeam && formik.errors.visitorTeam && (
            <small className="error">{formik.errors.visitorTeam}</small>
          )}
        </div>

        <div className="campo">
          <label htmlFor="category">Categoría</label>
          <select
            id="category"
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Seleccioná una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.name}
              </option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && (
            <small className="error">{formik.errors.category}</small>
          )}
        </div>

        <div className="campo">
          <label htmlFor="localScore">Puntos del local</label>
          <input
            type="number"
            min="0"
            id="localScore"
            name="localScore"
            value={formik.values.localScore}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.localScore && formik.errors.localScore && (
            <small className="error">{formik.errors.localScore}</small>
          )}
        </div>

        <div className="campo">
          <label htmlFor="visitorScore">Puntos del visitante</label>
          <input
            type="number"
            min="0"
            id="visitorScore"
            name="visitorScore"
            value={formik.values.visitorScore}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.visitorScore && formik.errors.visitorScore && (
            <small className="error">{formik.errors.visitorScore}</small>
          )}
        </div>

        <div className="campo">
          <label htmlFor="date">Fecha del partido</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.date && formik.errors.date && (
            <small className="error">{formik.errors.date}</small>
          )}
        </div>

        {errorGuardar && <p className="error">{errorGuardar}</p>}

        <button
          type="submit"
          disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
        >
          {formik.isSubmitting ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>

      <button type="button" onClick={() => navigate("/dashboard")}>
        Volver al Dashboard
      </button>
    </div>
  );
}

export default EditarPartido;
