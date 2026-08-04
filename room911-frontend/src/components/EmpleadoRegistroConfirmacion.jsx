import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { cargarQrDataUrl, descargarQrPng, imprimirQrPdf } from "../utils/qrUtils";
import "../styles/EmpleadoRegistroConfirmacion.css";

function EmpleadoRegistroConfirmacion({
    empleado,
    onRegistrarOtro,
    onVolverListado
}) {

    const [estadoCredencial, setEstadoCredencial] = useState({
        activa: false,
        verificando: true
    });

    const [identificadorQr, setIdentificadorQr] = useState(
        empleado?.identificadorQr || ""
    );

    const [qrDataUrl, setQrDataUrl] = useState("");
    const [cargandoQr, setCargandoQr] = useState(true);

    const urlActivacion = useMemo(() => {
        if (!identificadorQr) return "";
        return `${window.location.origin}/activar-credencial/${encodeURIComponent(identificadorQr)}`;
    }, [identificadorQr]);

    useEffect(() => {
        let cancelado = false;
        if (empleado) {
            setCargandoQr(true);
            cargarQrDataUrl(empleado).then((dataUrl) => {
                if (!cancelado) {
                    setQrDataUrl(dataUrl || "");
                    setCargandoQr(false);
                }
            });
        } else {
            setCargandoQr(false);
        }
        return () => {
            cancelado = true;
        };
    }, [empleado]);

    useEffect(() => {

        if (!empleado?.id) return;

        let activo = true;
        let timer;

        const consultarEstado = async () => {
            try {
                const response = await api.get(
                    `/empleados/${empleado.id}/credencial-estado`
                );

                if (!activo) return;

                const payload = response.data || {};
                const activa = Boolean(payload.credencialActiva);
                const codigo = payload.identificadorQr || identificadorQr;

                if (codigo) {
                    setIdentificadorQr(codigo);
                }

                setEstadoCredencial({
                    activa,
                    verificando: false
                });

                if (!activa) {
                    timer = setTimeout(consultarEstado, 3000);
                }
            } catch (error) {
                if (!activo) return;
                setEstadoCredencial((prev) => ({
                    ...prev,
                    verificando: false
                }));
                timer = setTimeout(consultarEstado, 5000);
            }
        };

        consultarEstado();

        return () => {
            activo = false;
            if (timer) clearTimeout(timer);
        };

    }, [empleado?.id, identificadorQr]);

    const descargarQr = () => {
        descargarQrPng(empleado, qrDataUrl);
    };

    const imprimirCredencial = () => {
        imprimirQrPdf(empleado, qrDataUrl);
    };

    return (
        <div className="modal-overlay">
            <div className="empleado-confirm-modal">
                <div className="empleado-confirm-header">
                    <h2>✔ Empleado registrado correctamente</h2>
                </div>

                <div className="empleado-confirm-grid">
                    <p><strong>Nombre:</strong> {empleado?.nombre} {empleado?.apellido}</p>
                    <p><strong>Documento:</strong> {empleado?.documento}</p>
                    <p><strong>Departamento:</strong> {empleado?.nombreDepartamento || "--"}</p>
                    <p>
                        <strong>Estado:</strong>{" "}
                        {empleado?.accesoPermitido ? "Activo" : "Inactivo"}
                    </p>
                    {identificadorQr && (
                        <p><strong>ID QR:</strong> {identificadorQr}</p>
                    )}
                </div>

                <div className="estado-activacion">
                    <p className="mensaje-activacion">
                        Escanee este código QR para activar su credencial
                    </p>
                    <p>
                        <strong>Estado:</strong>{" "}
                        {estadoCredencial.activa
                            ? "Credencial activada correctamente"
                            : estadoCredencial.verificando
                                ? "Esperando escaneo..."
                                : "Esperando escaneo"}
                    </p>
                    {urlActivacion && (
                        <p className="url-activacion">
                            URL de activación: {urlActivacion}
                        </p>
                    )}
                </div>

                <div className="empleado-confirm-qr">
                    <h3>Código QR generado</h3>

                    {cargandoQr ? (
                        <p>Cargando código QR...</p>
                    ) : qrDataUrl ? (
                        <img
                            src={qrDataUrl}
                            alt="Código QR generado para el empleado"
                        />
                    ) : (
                        <p>No se encontró el identificador del empleado.</p>
                    )}
                </div>

                <div className="empleado-confirm-actions">
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={descargarQr}
                        disabled={!qrDataUrl}
                    >
                        Descargar QR
                    </button>

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={imprimirCredencial}
                        disabled={!qrDataUrl}
                    >
                        Imprimir credencial
                    </button>

                    {identificadorQr && (
                        <Link
                            to={`/activar-credencial/${encodeURIComponent(identificadorQr)}`}
                            className="btn-secondary empleado-confirm-link-btn"
                        >
                            Abrir activación
                        </Link>
                    )}

                    {estadoCredencial.activa && identificadorQr && (
                        <Link
                            to={`/credencial/${encodeURIComponent(identificadorQr)}`}
                            className="btn-primary empleado-confirm-link-btn"
                        >
                            Ver credencial digital
                        </Link>
                    )}

                    <button
                        type="button"
                        className="btn-primary"
                        onClick={onRegistrarOtro}
                    >
                        Registrar otro empleado
                    </button>

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onVolverListado}
                    >
                        Volver al listado
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EmpleadoRegistroConfirmacion;
