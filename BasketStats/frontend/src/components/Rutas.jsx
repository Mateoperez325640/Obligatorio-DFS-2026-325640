import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./Login.jsx";
import Registro from "./Registro.jsx";
import Dashboard from "./Dashboard.jsx";
import CrearPartido from "./CrearPartido.jsx";
import EditarPartido from "./EditarPartido.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import GestionEquipos from "./GestionEquipos.jsx";
import GestionCategorias from "./GestionCategorias.jsx";

const Rutas = () => {
  const usuario = useSelector((state) => state.sesion.usuario);

  return (
    <BrowserRouter>
      <div className="contenedor-principal">
        <h1>BasketStats</h1>
        <p>Estadísticas y gestión de partidos de básquetbol</p>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          <Route
            path="/dashboard"
            element={usuario ? <Dashboard /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/partidos/crear"
            element={
              usuario ? <CrearPartido /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/partidos/editar/:id"
            element={
              usuario ? <EditarPartido /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/admin"
            element={
              usuario?.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          <Route
            path="/admin/equipos"
            element={
              usuario?.role === "admin" ? (
                <GestionEquipos />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          <Route
            path="/admin/categorias"
            element={
              usuario?.role === "admin" ? (
                <GestionCategorias />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Rutas;
