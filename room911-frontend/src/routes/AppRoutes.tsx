import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { authService } from "../services/authService";

// Code splitting: cada página se carga en su propio chunk
const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Empleados = lazy(() => import("../pages/Empleados"));
const EmpleadoDetalle = lazy(() => import("../pages/EmpleadoDetalle"));
const Departamentos = lazy(() => import("../pages/Departamentos"));
const HistorialAccesos = lazy(() => import("../pages/HistorialAccesos"));
const Administradores = lazy(() => import("../pages/Administradores"));
const SimuladorAcceso = lazy(() => import("../pages/SimuladorAcceso"));
const CredencialDigital = lazy(() => import("../pages/CredencialDigital"));

function RouteFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px] text-xs text-muted-foreground">
      Cargando módulo...
    </div>
  );
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuth = authService.isAuthenticated();
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

/** La página de administradores solo es accesible para SUPER_ADMIN y ADMIN_SISTEMAS. */
function AdminRoute({ children }: { children: JSX.Element }) {
  if (!authService.puedeGestionarAdministradores()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
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
          <Route
            path="/administradores"
            element={
              <AdminRoute>
                <Administradores />
              </AdminRoute>
            }
          />
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
