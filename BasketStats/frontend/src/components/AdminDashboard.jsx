import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GestionEquipos from "./GestionEquipos.jsx";
import GestionCategorias from "./GestionCategorias.jsx";
import GestionJugadores from "./GestionJugadores.jsx";

function AdminDashboard() {
  const usuario = useSelector((state) => state.sesion.usuario);
  const equipos = useSelector((state) => state.catalogos.equipos);
  const categorias = useSelector((state) => state.catalogos.categorias);
  const jugadores = useSelector((state) => state.jugadores.lista);
  const navigate = useNavigate();

  return (
    <main className="admin-dashboard">
      <header className="admin-hero">
        <div className="admin-hero-contenido">
          <span className="admin-sobretitulo">
            BASKETSTATS · ADMINISTRACIÓN
          </span>
          <h2>Panel de administración</h2>
          <p>
            Bienvenido, {usuario?.name || "administrador"}. Gestioná los
            catálogos y jugadores desde un mismo lugar.
          </p>
          <div className="admin-hero-etiquetas">
            <span>Gestión centralizada</span>
            <span>Datos actualizados con Redux</span>
          </div>
        </div>
        <button
          type="button"
          className="admin-boton-volver"
          onClick={() => navigate("/dashboard")}
        >
          ← Volver al Dashboard
        </button>
      </header>

      <div className="admin-indicadores" aria-label="Resumen de registros">
        <div className="admin-indicador">
          <span className="admin-indicador-etiqueta">Equipos registrados</span>
          <strong className="admin-indicador-valor">{equipos.length}</strong>
          <span className="admin-indicador-detalle">Catálogo de clubes</span>
        </div>
        <div className="admin-indicador">
          <span className="admin-indicador-etiqueta">
            Categorías registradas
          </span>
          <strong className="admin-indicador-valor">{categorias.length}</strong>
          <span className="admin-indicador-detalle">
            Clasificación de partidos
          </span>
        </div>
        <div className="admin-indicador">
          <span className="admin-indicador-etiqueta">
            Jugadores registrados
          </span>
          <strong className="admin-indicador-valor">{jugadores.length}</strong>
          <span className="admin-indicador-detalle">
            Perfiles y fotografías
          </span>
        </div>
      </div>

      <div className="admin-presentacion">
        <div>
          <span className="admin-sobretitulo admin-sobretitulo-oscuro">
            GESTIÓN DEL SISTEMA
          </span>
          <h3>Administrá tu liga</h3>
        </div>
        <p>
          Creá, editá y eliminá registros sin cambiar de pantalla. Los cambios
          se reflejan en los listados al guardar.
        </p>
      </div>

      <div className="admin-grid-catalogos">
        <section className="admin-seccion" aria-label="Gestión de equipos">
          <GestionEquipos />
        </section>

        <section className="admin-seccion" aria-label="Gestión de categorías">
          <GestionCategorias />
        </section>
      </div>

      <section
        className="admin-seccion admin-seccion-jugadores"
        aria-label="Gestión de jugadores"
      >
        <GestionJugadores />
      </section>
    </main>
  );
}

export default AdminDashboard;
