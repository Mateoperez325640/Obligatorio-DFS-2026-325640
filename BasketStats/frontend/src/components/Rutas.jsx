import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Registro from "./Registro.jsx";

const Rutas = () => {
  return (
    <BrowserRouter>
      <div className="contenedor-principal">
        <h1>BasketStats</h1>
        <p>Estadísticas y gestión de partidos de básquetbol</p>

        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default Rutas;
