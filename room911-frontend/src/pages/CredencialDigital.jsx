import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import CredencialDigitalCard from "../components/CredencialDigitalCard";
import { cargarQrDataUrl, descargarQrPng, imprimirQrPdf } from "../utils/qrUtils";
import "../styles/CredencialDigital.css";

function CredencialDigital() {

    const { codigoQr } = useParams();
    const [empleado, setEmpleado] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(true);
    const [qrDataUrl, setQrDataUrl] = useState("");

    useEffect(() => {

        const cargar = async () => {
            try {
                const response = await api.get(`/credenciales/${codigoQr}`);
                const payload = response.data || {};
                const emp = payload.empleado || payload;
                setEmpleado(emp);

                if (emp?.id) {
                    const dataUrl = await cargarQrDataUrl(emp.id);
                    setQrDataUrl(dataUrl || "");
                }
            } catch (error) {
                console.error(error);
                setMensaje("No fue posible obtener la credencial digital.");
            } finally {
                setLoading(false);
            }
        };

        cargar();

    }, [codigoQr]);

    const descargarQr = () => {
        descargarQrPng(empleado, qrDataUrl);
    };

    const imprimirCredencial = () => {
        imprimirQrPdf(empleado, qrDataUrl);
    };

    return (
        <div className="credencial-page">
            <div className="credencial-shell">
                <h1>Credencial digital ROOM_911</h1>
                {loading && <p>Cargando credencial...</p>}
                {mensaje && <p className="credencial-status">{mensaje}</p>}

                {!loading && empleado && (
                    <CredencialDigitalCard
                        empleado={empleado}
                        qrUrl={qrDataUrl}
                        onDescargar={descargarQr}
                        onImprimir={imprimirCredencial}
                    />
                )}

                <Link to="/" className="credencial-back-link">
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}

export default CredencialDigital;
