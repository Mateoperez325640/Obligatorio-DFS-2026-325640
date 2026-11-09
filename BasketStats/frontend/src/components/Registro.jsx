import { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registrarApi } from "../services/authServices.js";

const esquemaRegistro = Yup.object({
  name: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(30, "El nombre no puede superar los 30 caracteres")
    .required("El nombre es obligatorio"),

  username: Yup.string()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(30, "El usuario no puede superar los 30 caracteres")
    .matches(/^[a-zA-Z0-9]+$/, "Solo se permiten letras y números")
    .required("El usuario es obligatorio"),

  email: Yup.string()
    .email("Ingresá un correo válido")
    .required("El correo es obligatorio"),

  password: Yup.string()
    .min(3, "La contraseña debe tener al menos 3 caracteres")
    .max(30, "La contraseña no puede superar los 30 caracteres")
    .required("La contraseña es obligatoria"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Debés repetir la contraseña"),
});

function Registro() {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: esquemaRegistro,

    onSubmit: async (valores) => {
      setMensaje("");
      setError("");

      try {
        const respuesta = await registrarApi(valores);
        setMensaje(respuesta.message);
        formik.resetForm();
      } catch (error) {
        setError(
          error.response?.data?.errors?.[0] ||
          error.response?.data?.message ||
          "No se pudo registrar el usuario"
        );
      }
    },
  });

  return (
    <div className="login">
      <h2>Crear cuenta</h2>

      <form onSubmit={formik.handleSubmit} noValidate>
        <div className="campo">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Ingresá tu nombre"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <small className="error">{formik.errors.name}</small>
          )}
        </div>

        <div className="campo">
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Elegí un usuario"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username && (
            <small className="error">{formik.errors.username}</small>
          )}
        </div>

        <div className="campo">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Ingresá tu correo"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <small className="error">{formik.errors.email}</small>
          )}
        </div>

        <div className="campo">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Ingresá una contraseña"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <small className="error">{formik.errors.password}</small>
          )}
        </div>

        <div className="campo">
          <label htmlFor="confirmPassword">Repetir contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Repetí tu contraseña"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.confirmPassword &&
            formik.errors.confirmPassword && (
              <small className="error">
                {formik.errors.confirmPassword}
              </small>
            )}
        </div>

        {mensaje && <p className="mensaje-exito">{mensaje}</p>}
        {error && <p className="error">{error}</p>}

        <button
          type="submit"
          disabled={
            !formik.dirty ||
            !formik.isValid ||
            formik.isSubmitting
          }
        >
          {formik.isSubmitting ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      <p className="texto-enlace">
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </div>
  );
}

export default Registro;
