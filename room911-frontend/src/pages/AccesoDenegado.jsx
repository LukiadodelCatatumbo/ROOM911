import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTimesCircle, FaBuilding } from "react-icons/fa";
import "../styles/AccesoDenegado.css";

function AccesoDenegado() {

    const navigate = useNavigate();
    const { state } = useLocation();

    useEffect(() => {

        const timer = setTimeout(() => {
            navigate("/simulador-acceso");
        }, 4000);

        return () => clearTimeout(timer);

    }, [navigate]);

    const empleado = {
        nombre: state?.nombre || "Empleado no identificado",
        departamento: state?.departamento || "--",
        hora: state?.hora || new Date().toLocaleTimeString()
    };

    return (

        <main className="acceso-denegado-page">

            <div className="acceso-denegado-card">

                <div className="denegado-icon-wrap">
                    <FaTimesCircle className="denegado-icon" />
                </div>

                <h1>ACCESO DENEGADO</h1>

                <p className="acceso-subtitulo">
                    No fue posible autorizar el ingreso.
                </p>

                <div className="acceso-detalles">

                    <div className="info-item">
                        <span className="info-label">
                            Empleado
                        </span>

                        <h2 className="info-val">
                            {empleado.nombre}
                        </h2>
                    </div>

                    <div className="info-item">
                        <span className="info-label">
                            Departamento
                        </span>

                        <h2 className="info-val">
                            {empleado.departamento}
                        </h2>
                    </div>

                    <div className="info-item">
                        <span className="info-label">
                            Hora del intento
                        </span>

                        <h2 className="info-val">
                            {empleado.hora}
                        </h2>
                    </div>

                    <div className="info-item">
                        <span className="info-label">
                            Estado
                        </span>

                        <h2 className="info-val">
                            Acceso rechazado
                        </h2>
                    </div>

                </div>

                <p className="volver-msg">
                    Regresando al simulador en 4 segundos...
                </p>

                <div className="acceso-footer">
                    <FaBuilding />
                    <span>XYZ Laboratorios</span>
                </div>

            </div>

        </main>

    );

}

export default AccesoDenegado;