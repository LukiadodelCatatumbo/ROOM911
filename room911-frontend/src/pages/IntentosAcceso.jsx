import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../styles/IntentosAcceso.css";

function IntentosAcceso() {

    const [intentos, setIntentos] = useState([]);

    useEffect(() => {
        obtenerIntentos();
    }, []);

    const obtenerIntentos = async () => {

        try {

            const response = await api.get("/intento-acceso");

            setIntentos(response.data);

        } catch (error) {

            console.error("Error al cargar los intentos", error);

        }

    };

    return (

        <>
            <Sidebar />

            <div className="intentos-container">

                <div className="header">

                    <h1>Historial de Intentos de Acceso</h1>

                </div>

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Fecha</th>

                            <th>Empleado</th>

                            <th>Documento</th>

                            <th>Estado</th>

                            <th>Mensaje</th>

                        </tr>

                    </thead>

                    <tbody>

                        {intentos.map((intento) => (

                            <tr key={intento.id}>

                                <td>{intento.id}</td>

                                <td>
                                    {new Date(
                                        intento.fechaAcceso
                                    ).toLocaleString()}
                                </td>

                                <td>{intento.nombreEmpleado}</td>

                                <td>{intento.documento}</td>

                                <td>

                                    <span
                                        className={
                                            intento.exito
                                                ? "estado-exito"
                                                : "estado-error"
                                        }
                                    >
                                        {intento.exito
                                            ? "Permitido"
                                            : "Denegado"}
                                    </span>

                                </td>

                                <td>{intento.message}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </>

    );

}

export default IntentosAcceso;