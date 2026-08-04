import { useEffect, useState } from "react";
import { cargarQrDataUrl, descargarQrPng, imprimirQrPdf } from "../utils/qrUtils";

function EmpleadoQrExportModal({ empleado, onCerrar }) {

    const [qrDataUrl, setQrDataUrl] = useState("");
    const [cargandoQr, setCargandoQr] = useState(true);

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

    const descargarPng = () => {
        descargarQrPng(empleado, qrDataUrl);
    };

    const descargarPdf = () => {
        imprimirQrPdf(empleado, qrDataUrl);
    };

    return (
        <div className="modal-overlay">
            <div className="qr-export-modal">
                <h2>Exportar QR</h2>

                <div className="qr-export-info">
                    <p>
                        <strong>Nombre:</strong> {empleado?.nombre} {empleado?.apellido}
                    </p>
                    <p>
                        <strong>Departamento:</strong> {empleado?.nombreDepartamento || "--"}
                    </p>
                    <p>
                        <strong>ID interno:</strong> {empleado?.id}
                    </p>
                </div>

                <div className="qr-export-image">
                    {cargandoQr ? (
                        <p>Cargando código QR...</p>
                    ) : qrDataUrl ? (
                        <img
                            src={qrDataUrl}
                            alt="Código QR generado del empleado"
                        />
                    ) : (
                        <p>No se pudo generar el QR.</p>
                    )}
                </div>

                <div className="qr-export-actions">
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={descargarPng}
                        disabled={!qrDataUrl}
                    >
                        Descargar PNG
                    </button>

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={descargarPdf}
                        disabled={!qrDataUrl}
                    >
                        Descargar PDF
                    </button>

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onCerrar}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EmpleadoQrExportModal;
