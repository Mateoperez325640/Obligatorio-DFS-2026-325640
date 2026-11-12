import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GestionEquipos from "./GestionEquipos.jsx";
import GestionCategorias from "./GestionCategorias.jsx";
import GestionJugadores from "./GestionJugadores.jsx";

function AdminDashboard() {
  const usuario = useSelector((state) => state.sesion.usuario);
  const navigate = useNavigate();

  return (
    <div className="login">
      <h2>Panel de administración</h2>

      <p>Bienvenido, {usuario?.name}</p>

      <h3>Gestión del sistema</h3>

      <section>
        <h3>Equipos</h3>
        <GestionEquipos />
      </section>

      <hr />

      <section>
        <h3>Categorías</h3>
        <GestionCategorias />
      </section>

      <hr />

      <section>
        <h3>Jugadores</h3>
        <GestionJugadores />
      </section>

      <button type="button" onClick={() => navigate("/dashboard")}>
        Volver al Dashboard
      </button>
    </div>
  );
}

export default AdminDashboard;
