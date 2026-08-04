import {
    FaTachometerAlt,
    FaUsers,
    FaBuilding,
    FaDoorOpen,
    FaHistory,
    FaExclamationTriangle,
    FaSignOutAlt
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    const cerrarSesion = () => {

        localStorage.removeItem("admin");
        navigate("/");

    };

    return (

        <aside className="sidebar">

            <h2 className="logo">
                ROOM<span>_911</span>
            </h2>

            <nav className="menu">

                <NavLink to="/dashboard"
                aria-label="Ir al Dashboard">
                    <FaTachometerAlt />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/empleados"
                aria-label="Ir a Empleados">
                    <FaUsers />
                    <span>Empleados</span>
                </NavLink>

                <NavLink to="/departamentos"
                aria-label="Ir a Departamentos">
                    <FaBuilding />
                    <span>Departamentos</span>
                </NavLink>

                <NavLink to="/accesos"
                aria-label="Ir a Accesos">
                    <FaDoorOpen />
                    <span>Accesos</span>
                </NavLink>

                <NavLink to="/historial"
                aria-label="Ir a Historial">
                    <FaHistory />
                    <span>Historial</span>
                </NavLink>

                <NavLink to="/intentos-acceso"
                aria-label="Ir a Intentos de Acceso">
                    <FaExclamationTriangle />
                    <span>Intentos</span>
                </NavLink>

            </nav>

            <button
                className="logout"
                onClick={cerrarSesion}
                aria-label="Cerrar sesión"
            >
                <FaSignOutAlt />
                <span>Cerrar sesión</span>
            </button>

        </aside>

    );

}
export default Sidebar;