import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { loginApi } from "../services/authServices.js";
import { iniciarSesionSlice } from "../redux/features/sesionSlice.js";

const esquemaLogin = Yup.object({
  username: Yup.string()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(30, "El usuario no puede superar los 30 caracteres")
    .required("El usuario es obligatorio"),

  password: Yup.string()
    .min(3, "La contraseña debe tener al menos 3 caracteres")
    .max(30, "La contraseña no puede superar los 30 caracteres")
    .required("La contraseña es obligatoria"),
});

function Login() {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: esquemaLogin,
    onSubmit: async (valores) => {
      setMensaje("");
      setError("");

      try {
        const respuesta = await loginApi(valores);

        localStorage.setItem("token", respuesta.token);
        localStorage.setItem("usuario", JSON.stringify(respuesta.user));

        dispatch(iniciarSesionSlice(respuesta.user));

        navigate("/dashboard");
      } catch (error) {
        setError(error.response?.data?.message || "No se pudo iniciar sesión");
      }
    },
  });

  return (
    <div className="login">
      <h2>Iniciar sesión</h2>

      <form onSubmit={formik.handleSubmit} noValidate>
        <div className="campo">
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username && (
            <small className="error">{formik.errors.username}</small>
          )}
        </div>

        <div className="campo">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <small className="error">{formik.errors.password}</small>
          )}
        </div>

        {mensaje && <p className="mensaje-exito">{mensaje}</p>}
        {error && <p className="error">{error}</p>}

        <button
          type="submit"
          disabled={!formik.dirty || !formik.isValid || formik.isSubmitting}
        >
          {formik.isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p className="texto-enlace">
        ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
      </p>
    </div>
  );
}

export default Login;
