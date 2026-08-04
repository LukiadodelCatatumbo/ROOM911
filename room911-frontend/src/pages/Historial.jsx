import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../styles/HistorialAccesos.css";

function Historial() {

    const [historial, setHistorial] = useState([]);

    useEffect(() => {
        obtenerHistorial();
    }, []);

    const obtenerHistorial = async () => {

        try {

            const response = await api.get("/historial-acceso");
            console.log(response.data);
            setHistorial(response.data);

        } catch (error) {

            console.error("Error al cargar historial", error);

        }

    };

    return (
        <>
            <Sidebar />

            <div className="historial-container">

                <div className="header">

                    <h1>Historial de Accesos</h1>

                    <button
                        className="btn-primary"
                        onClick={obtenerHistorial}
                    >
                        Actualizar
                    </button>

                </div>

                <table>

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Documento</th>
                            <th>Empleado</th>
                            <th>Departamento</th>
                            <th>Ingreso</th>
                            <th>Salida</th>
                            <th>Estado</th>
                            <th>Observaciones</th>
                        </tr>
                    </thead>

                    <tbody>

                        {historial.map((registro) => (

                            <tr key={registro.id}>

                                <td>{registro.id}</td>
                                <td>{registro.documento}</td>
                                <td>{registro.nombreEmpleado}</td>
                                <td>{registro.departamento}</td>

                                <td>
                                    {registro.fechaIngreso
                                        ? new Date(registro.fechaIngreso).toLocaleString()
                                        : "-"}
                                </td>

                                <td>
                                    {registro.fechaSalida
                                        ? new Date(registro.fechaSalida).toLocaleString()
                                        : "--"}
                                </td>

                                <td>

                                    <span
                                        className={
                                            registro.accesoPermitido
                                                ? "estado-permitido"
                                                : "estado-denegado"
                                        }
                                    >
                                        {registro.accesoPermitido
                                            ? "Permitido"
                                            : "Denegado"}
                                    </span>

                                </td>

                                <td>{registro.observaciones || "-"}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>
        </>
    );

}

export default Historial;