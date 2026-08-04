import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import CredencialDigitalCard from "../components/CredencialDigitalCard";
import { cargarQrDataUrl, descargarQrPng, imprimirQrPdf } from "../utils/qrUtils";
import "../styles/CredencialDigital.css";

function ActivarCredencial() {

    const { codigoQr } = useParams();

    const [empleado, setEmpleado] = useState(null);
    const [activada, setActivada] = useState(false);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState("");
    const [qrDataUrl, setQrDataUrl] = useState("");

    useEffect(() => {

        const cargar = async () => {
            try {
                const response = await api.get(`/credenciales/${codigoQr}`);
                const payload = response.data || {};
                const emp = payload.empleado || payload;

                setEmpleado(emp);
                setActivada(Boolean(payload.credencialActiva));

                if (emp?.id) {
                    const dataUrl = await cargarQrDataUrl(emp.id);
                    setQrDataUrl(dataUrl || "");
                }
            } catch (error) {
                console.error(error);
                setMensaje("No fue posible consultar la credencial.");
            } finally {
                setLoading(false);
            }
        };

        cargar();

    }, [codigoQr]);

    const activar = async () => {

        try {
            const response = await api.post(`/credenciales/${codigoQr}/activar`);
            const payload = response.data || {};
            const emp = payload.empleado || payload;

            setEmpleado(emp);
            setActivada(true);
            setMensaje("Credencial activada correctamente.");

            if (emp?.id) {
                const dataUrl = await cargarQrDataUrl(emp.id);
                setQrDataUrl(dataUrl || "");
            }
        } catch (error) {
            console.error(error);
            setMensaje("No fue posible activar la credencial.");
        }

    };

    const descargarQr = () => {
        descargarQrPng(empleado, qrDataUrl);
    };

    const imprimirCredencial = () => {
        imprimirQrPdf(empleado, qrDataUrl);
    };

    return (
        <div className="credencial-page">
            <div className="credencial-shell">
                <h1>Activación de credencial digital</h1>

                {loading && <p>Consultando información de credencial...</p>}
                {mensaje && <p className="credencial-status">{mensaje}</p>}

                {!loading && empleado && (
                    <>
                        {!activada && (
                            <div className="activacion-banner">
                                <p>Confirme la activación de su credencial corporativa digital.</p>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={activar}
                                >
                                    Activar credencial
                                </button>
                            </div>
                        )}

                        {activada && (
                            <div className="activacion-ok">
                                ✔ Credencial activada correctamente
                            </div>
                        )}

                        <CredencialDigitalCard
                            empleado={empleado}
                            qrUrl={qrDataUrl}
                            onDescargar={descargarQr}
                            onImprimir={imprimirCredencial}
                        />
                    </>
                )}

                <Link to="/" className="credencial-back-link">
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}

export default ActivarCredencial;
