import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Empleados from "../pages/Empleados";
import EmpleadoDetalle from "../pages/EmpleadoDetalle";
import Departamentos from "../pages/Departamentos";
import HistorialAccesos from "../pages/HistorialAccesos";
import Administradores from "../pages/Administradores";
import SimuladorAcceso from "../pages/SimuladorAcceso";
import CredencialDigital from "../pages/CredencialDigital";
import { AppLayout } from "../components/layout/AppLayout";
import { authService } from "../services/authService";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuth = authService.isAuthenticated();
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Login */}
      <Route path="/login" element={<Login />} />

      {/* Public Mobile Credential & Simulator */}
      <Route path="/simulador" element={<SimuladorAcceso />} />
      <Route path="/simulador-acceso" element={<Navigate to="/simulador" replace />} />
      <Route path="/credencial/:codigoQr" element={<CredencialDigital />} />
      <Route path="/activar-credencial/:codigoQr" element={<CredencialDigital />} />

      {/* Protected Admin Suite with Figma Revamp Layout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/empleados" element={<Empleados />} />
        <Route path="/empleados/:id" element={<EmpleadoDetalle />} />
        <Route path="/departamentos" element={<Departamentos />} />
        <Route path="/historial" element={<HistorialAccesos />} />
        <Route path="/accesos" element={<Navigate to="/historial" replace />} />
        <Route path="/intentos-acceso" element={<Navigate to="/historial" replace />} />
        <Route path="/administradores" element={<Administradores />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
