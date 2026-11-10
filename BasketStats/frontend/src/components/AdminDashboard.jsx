import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const usuario = useSelector((state) => state.sesion.usuario);
  const navigate = useNavigate();

  return (
    <div className="login">
      <h2>Panel de administración</h2>

      <p>Bienvenido, {usuario?.name}</p>

      <h3>Gestión del sistema</h3>

      <button type="button" onClick={() => navigate("/admin/equipos")}>
        Gestionar equipos
      </button>

      <button type="button" onClick={() => navigate("/admin/categorias")}>
        Gestionar categorías
      </button>

      <p>Próximamente: gestión de jugadores.</p>

      <button type="button" onClick={() => navigate("/dashboard")}>
        Volver al Dashboard
      </button>
    </div>
  );
}

export default AdminDashboard;
