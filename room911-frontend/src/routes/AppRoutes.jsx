import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Empleados from "../pages/Empleados";
import Departamentos from "../pages/Departamentos";
import Accesos from "../pages/Accesos";
import Historial from "../pages/Historial";
import IntentosAcceso from "../pages/IntentosAcceso";
import ActivarCredencial from "../pages/ActivarCredencial";
import CredencialDigital from "../pages/CredencialDigital";
import SimuladorAcceso from "../pages/SimuladorAcceso";
import AccesoConcedido from "../pages/AccesoConcedido";
import AccesoDenegado from "../pages/AccesoDenegado";
import ErrorConexion from "../pages/ErrorConexion";

import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";

function AppRoutes() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Login />}
            />

            <Route
                path="/activar-credencial/:codigoQr"
                element={<ActivarCredencial />}
            />

            <Route
                path="/credencial/:codigoQr"
                element={<CredencialDigital />}
            />

            <Route
                path="/simulador-acceso"
                element={<SimuladorAcceso />}
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/empleados"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Empleados />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/departamentos"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Departamentos />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/accesos"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Accesos />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/historial"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Historial />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/intentos-acceso"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <IntentosAcceso />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/acceso-concedido"
                element={<AccesoConcedido />}
            />

            <Route
                path="/acceso-denegado"
                element={<AccesoDenegado />}
            />

            <Route
                path="/error-conexion"
                element={<ErrorConexion />}
            />

        </Routes>

    );

}
export default AppRoutes;