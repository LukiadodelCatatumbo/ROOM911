import { useLocation, useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaBuilding } from "react-icons/fa";
import "../styles/ErrorConexion.css";

function ErrorConexion() {

    const navigate = useNavigate();
    const { state } = useLocation();

    const hora = state?.hora || new Date().toLocaleTimeString();

    return (

        <main className="error-page">

            <div className="error-card">

                <div className="error-icon-wrap">
                    <FaExclamationTriangle className="error-icon" />
                </div>

                <h1>ERROR DE CONEXIÓN</h1>

                <p className="error-subtitulo">
                    No fue posible verificar el acceso.
                </p>

                <div className="error-detalles">

                    <div className="info-item">

                        <span className="info-label">
                            Estado
                        </span>

                        <h2 className="info-val">
                            Servidor no disponible
                        </h2>

                    </div>

                    <div className="info-item">

                        <span className="info-label">
                            Hora
                        </span>

                        <h2 className="info-val">
                            {hora}
                        </h2>

                    </div>

                    <div className="info-item">

                        <span className="info-label">
                            Acción
                        </span>

                        <h2 className="info-val">
                            Reintentar conexión
                        </h2>

                    </div>

                </div>

                <button
                    className="btn-reintentar"
                    onClick={() => navigate("/simulador-acceso")}
                >
                    Reintentar
                </button>

                <div className="error-footer">
                    <FaBuilding />
                    <span>XYZ Laboratorios</span>
                </div>

            </div>

        </main>

    );

}

export default ErrorConexion;