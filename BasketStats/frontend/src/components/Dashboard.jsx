import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cerrarSesionSlice } from "../redux/features/sesionSlice.js";
import { obtenerPartidosApi } from "../services/partidosServices.js";

function Dashboard() {
  const usuario = useSelector((state) => state.sesion.usuario);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [partidos, setPartidos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarPartidos = async () => {
      try {
        const respuesta = await obtenerPartidosApi();
        setPartidos(respuesta);
      } catch (error) {
        if (error.response?.status === 401) {
          setError("La sesión fue rechazada. Volvé a iniciar sesión.");
        } else {
          setError("No se pudieron cargar los partidos.");
        }
      } finally {
        setCargando(false);
      }
    };

    cargarPartidos();
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    dispatch(cerrarSesionSlice());

    navigate("/login");
  };

  if (!usuario) {
    return (
      <div className="login">
        <h2>No hay una sesión activa</h2>
        <p>Debés iniciar sesión para continuar.</p>
      </div>
    );
  }

  return (
    <div className="login">
      <h2>Mi panel</h2>

      <p>Bienvenido, {usuario.name}</p>

      <p>
        <strong>Usuario:</strong> {usuario.username}
      </p>

      <p>
        <strong>Rol:</strong> {usuario.role}
      </p>

      <p>
        <strong>Plan:</strong> {usuario.plan}
      </p>

      <h3>Mis partidos</h3>

      {cargando && <p>Cargando partidos...</p>}

      {error && <p className="error">{error}</p>}

      {!cargando && !error && (
        <>
          <p>
            <strong>Total de partidos:</strong> {partidos.total}
          </p>

          {partidos.partidos.length === 0 ? (
            <p>Todavía no tenés partidos registrados.</p>
          ) : (
            <div>
              {partidos.partidos.map((partido) => (
                <div key={partido._id}>
                  <pre>{JSON.stringify(partido, null, 2)}</pre>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </div>
  );
}

export default Dashboard;
