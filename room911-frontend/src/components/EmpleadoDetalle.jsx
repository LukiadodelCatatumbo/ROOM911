import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/EmpleadoDetalle.css";

function EmpleadoDetalle({ empleado, onCerrar }) {

    const [intentos, setIntentos] = useState([]);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    useEffect(() => {

        if (empleado) {
            obtenerIntentos();
        }

    }, [empleado]);

    const obtenerIntentos = async () => {

        try {

            const response = await api.get(
                `/intento-acceso/empleado/${empleado.id}`
            );

            setIntentos(response.data);

        } catch (error) {

            console.error("Error al cargar intentos", error);

        }

    };

    const filtrarIntentos = async () => {

        if (!fechaInicio || !fechaFin) {

            alert("Seleccione ambas fechas");

            return;

        }

        try {

            const response = await api.get(
                `/intento-acceso/empleado/${empleado.id}/fechas`,
                {
                    params: {
                        inicio: fechaInicio,
                        fin: fechaFin
                    }
                }
            );

            setIntentos(response.data);

        } catch (error) {

            console.error(error);

            alert("Error al filtrar los intentos");

        }

    };

    const descargarPDF = async () => {

        try {

            const response = await api.get(

                `/intento-acceso/pdf/${empleado.id}`,

                {
                    responseType: "blob"
                }

            );

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");

            link.href = url;
            link.download = `Historial_${empleado.documento}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(error);

            alert("No fue posible descargar el PDF");

        }

    };

    return (

        <div className="detalle-modal">

            <h2>Detalle del Empleado</h2>

            <div className="detalle-info">

                <p>
                    <strong>Documento:</strong> {empleado.documento}
                </p>

                <p>
                    <strong>Nombre:</strong>{" "}
                    {empleado.nombre} {empleado.apellido}
                </p>

                <p>
                    <strong>Correo:</strong> {empleado.correo}
                </p>

                <p>
                    <strong>Cargo:</strong> {empleado.cargo}
                </p>

                <p>
                    <strong>Departamento:</strong>{" "}
                    {empleado.nombreDepartamento}
                </p>

                <p>
                    <strong>Acceso:</strong>{" "}
                    {empleado.accesoPermitido
                        ? "Permitido"
                        : "Denegado"}
                </p>

            </div>

            <hr />

            <h3>Intentos de acceso</h3>

            <div className="filtros-fechas">

                <div>

                    <label>Desde</label>

                    <input
                        type="datetime-local"
                        value={fechaInicio}
                        onChange={(e) =>
                            setFechaInicio(e.target.value)
                        }
                    />

                </div>

                <div>

                    <label>Hasta</label>

                    <input
                        type="datetime-local"
                        value={fechaFin}
                        onChange={(e) =>
                            setFechaFin(e.target.value)
                        }
                    />

                </div>

                <button
                    className="btn-primary"
                    onClick={filtrarIntentos}
                >
                    Filtrar
                </button>

                <button
                    className="btn-secondary"
                    onClick={() => {

                        setFechaInicio("");
                        setFechaFin("");

                        obtenerIntentos();

                    }}
                >
                    Mostrar todos
                </button>

                <button
                    className="btn-primary"
                    onClick={descargarPDF}
                >
                    Descargar PDF
                </button>

            </div>

            <table>

                <thead>

                    <tr>

                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Mensaje</th>

                    </tr>

                </thead>

                <tbody>

                    {intentos.length > 0 ? (

                        intentos.map((intento) => (

                            <tr key={intento.id}>

                                <td>

                                    {new Date(
                                        intento.fechaAcceso
                                    ).toLocaleString()}

                                </td>

                                <td>

                                    <span
                                        className={
                                            intento.exito
                                                ? "estado-permitido"
                                                : "estado-denegado"
                                        }
                                    >
                                        {intento.exito
                                            ? "Permitido"
                                            : "Denegado"}
                                    </span>

                                </td>

                                <td>{intento.message}</td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td
                                colSpan="3"
                                style={{
                                    textAlign: "center"
                                }}
                            >
                                No hay registros para mostrar.
                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

            <div className="acciones-modal">

                <button
                    className="btn-secondary"
                    onClick={onCerrar}
                >
                    Cerrar
                </button>

            </div>

        </div>

    );

}

export default EmpleadoDetalle;