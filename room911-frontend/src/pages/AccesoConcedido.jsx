import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaBuilding } from "react-icons/fa";
import "../styles/AccesoConcedido.css";

function AccesoConcedido() {
    const navigate = useNavigate();
    const { state } = useLocation();

    useEffect(() => {

        const timer = setTimeout(() => {
            navigate("/simulador-acceso");
        }, 4000);

        return () => clearTimeout(timer);

    }, [navigate]);

    const empleado = {
        nombre: state?.nombre || "Juan Pérez",
        departamento: state?.departamento || "Producción",
        hora: state?.hora || new Date().toLocaleTimeString()
    };

    return (

        <main className="acceso-ok-page">

            <div className="acceso-ok-card">

                <div className="ok-icon-wrap">
                    <FaCheckCircle className="ok-icon" />
                </div>

                <h1>ACCESO AUTORIZADO</h1>

                <p className="acceso-subtitulo">
                    Bienvenido a ROOM_911
                </p>

                <div className="acceso-detalles">

                    <div className="info-item">
                        <span className="info-label">
                            Nombre del empleado
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
                            Hora del acceso
                        </span>

                        <h2 className="info-val">
                            {empleado.hora}
                        </h2>
                    </div>

                    <div className="info-item">
                        <span className="info-label">
                            Ubicación
                        </span>

                        <h2 className="info-val">
                            ROOM_911
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

export default AccesoConcedido;