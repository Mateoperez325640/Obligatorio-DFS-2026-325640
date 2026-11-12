import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  obtenerEquiposApi,
  obtenerCategoriasApi,
} from "../services/catalogosServices.js";
import {
  obtenerPartidosApi,
  editarPartidoApi,
} from "../services/partidosServices.js";
import { buscarFeriadoPorFecha } from "../services/feriadosServices.js";
import { actualizarPartidoSlice } from "../redux/features/partidosSlice.js";
import { cargarCatalogosSlice } from "../redux/features/catalogosSlice.js";

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

function EditarPartido({ idPartido, onPartidoActualizado, onVolver }) {
  const { id: idRuta } = useParams();
  const id = idPartido || idRuta;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const partidoEnStore = useSelector((state) =>
    state.partidos.lista.find((partido) => partido.id === id),
  );

  const equipos = useSelector((state) => state.catalogos.equipos);
  const categorias = useSelector((state) => state.catalogos.categorias);

  const [partido, setPartido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [errorGuardar, setErrorGuardar] = useState("");

  useEffect(() => {
    let activo = true;

    const cargarDatos = async () => {
      setCargando(true);
      setError("");
      setPartido(null);

      try {
        let partidoEncontrado = partidoEnStore;

        if (!partidoEncontrado) {
          const respuestaPartidos = await obtenerPartidosApi();

          if (!Array.isArray(respuestaPartidos?.partidos)) {
            throw new Error("La API devolvió partidos inválidos.");
          }

          partidoEncontrado = respuestaPartidos.partidos.find(
            (partido) => partido.id === id,
          );
        }

        if (!partidoEncontrado) {
          if (activo) {
            setError("No se encontró el partido.");
          }
          return;
        }

        if (equipos.length === 0 || categorias.length === 0) {
          const respuestaEquipos = await obtenerEquiposApi();
          const respuestaCategorias = await obtenerCategoriasApi();

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
        }

        if (!activo) {
          return;
        }

        setPartido(partidoEncontrado);
      } catch (error) {
        if (activo) {
          setError("No se pudieron cargar los datos del partido.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarDatos();

    return () => {
      activo = false;
    };
  }, [id, partidoEnStore, equipos.length, categorias.length, dispatch]);

  const volver = () => {
    if (onVolver) {
      onVolver();
    } else {
      navigate("/dashboard");
    }
  };

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
        const fechaOriginal = partido?.date?.substring(0, 10);

        if (valores.date !== fechaOriginal) {
          let feriado;

          try {
            feriado = await buscarFeriadoPorFecha(valores.date);
          } catch (error) {
            setErrorGuardar(
              "No se pudieron verificar los feriados de Uruguay. " +
                "Intentá nuevamente antes de guardar el partido.",
            );
            return;
          }

          if (feriado) {
            const fechaFormateada = valores.date.split("-").reverse().join("/");

            setErrorGuardar(
              `No se puede programar un partido el ${fechaFormateada} ` +
                `porque es feriado en Uruguay: ${feriado.name}. ` +
                "Seleccioná otra fecha.",
            );
            return;
          }
        }

        const datosPartido = {
          ...valores,
          localScore: Number(valores.localScore),
          visitorScore: Number(valores.visitorScore),
        };

        const respuesta = await editarPartidoApi(id, datosPartido);
        const partidoActualizado = respuesta?.partido;

        if (!partidoActualizado?.id || partidoActualizado.id !== id) {
          setErrorGuardar(
            "El servidor no devolvió los datos del partido actualizado. " +
              "Actualizá la página para verificar los cambios.",
          );
          return;
        }

        dispatch(actualizarPartidoSlice(partidoActualizado));

        if (onPartidoActualizado) {
          onPartidoActualizado();
        } else {
          navigate("/dashboard");
        }
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
        <button type="button" onClick={volver}>
          Volver al Dashboard
        </button>
      </div>
    );
  }

  if (equipos.length === 0 || categorias.length === 0) {
    return (
      <div className="login">
        <p className="error">
          No hay equipos o categorías disponibles para editar el partido.
        </p>
        <button type="button" onClick={volver}>
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
            onChange={(evento) => {
              formik.handleChange(evento);
              setErrorGuardar("");
            }}
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

      <button type="button" onClick={volver}>
        Volver al Dashboard
      </button>
    </div>
  );
}

export default EditarPartido;
