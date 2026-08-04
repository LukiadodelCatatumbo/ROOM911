import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/charts/DashboardCards";
import AccesosChart from "../components/charts/AccesosChart";
import DepartamentosChart from "../components/charts/DepartamentosChart";
import AccesosEstadoChart from "../components/charts/AccesosEstadoChart";

import {
    obtenerResumen,
    obtenerAccesosSemana
} from "../services/dashboardService";

import {
    obtenerDepartamentos
} from "../services/departamentoService";

import "../styles/Dashboard.css";

function Dashboard() {

    const [resumen, setResumen] = useState({
        empleados: 0,
        departamentos: 0,
        accesosHoy: 0,
        denegadosHoy: 0
    });

    const [accesosSemana, setAccesosSemana] = useState([]);

    const [departamentos, setDepartamentos] = useState([]);

    useEffect(() => {
        cargarDashboard();
    }, []);

    const cargarDashboard = async () => {

        try {

            const resumenData = await obtenerResumen();

            const accesosData = await obtenerAccesosSemana();

            const departamentosData = await obtenerDepartamentos();

            setResumen(resumenData);

            setAccesosSemana(accesosData);

            setDepartamentos(departamentosData);

        } catch (error) {

            console.error("Error cargando dashboard", error);

        }

    };

    return (

        <>

            <Sidebar />

            <div className="dashboard">

                <h1>Dashboard</h1>

                <DashboardCards resumen={resumen} />

                <div className="dashboard-grid">

                    <div className="chart-card">

                        <AccesosChart
                            datos={accesosSemana}
                        />

                    </div>

                    <div className="chart-card">

                        <DepartamentosChart
                            datos={departamentos}
                        />

                    </div>

                    <div className="chart-card">

                        <AccesosEstadoChart
                            resumen={resumen}
                        />

                    </div>

                </div>

            </div>

        </>

    );

}

export default Dashboard;