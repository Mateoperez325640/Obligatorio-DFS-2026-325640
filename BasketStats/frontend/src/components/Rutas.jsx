import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./Login.jsx";
import Registro from "./Registro.jsx";
import Dashboard from "./Dashboard.jsx";

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

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Rutas;
