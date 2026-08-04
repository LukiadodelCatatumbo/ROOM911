function CredencialDigitalCard({
    empleado,
    qrUrl,
    onDescargar,
    onImprimir
}) {

    return (
        <div className="credencial-digital-card">
            <div className="credencial-header">
                <div className="credencial-logo">ROOM_911</div>
                <div className="credencial-titulo">Credencial corporativa digital</div>
            </div>

            <div className="credencial-body">
                <p><strong>Nombre:</strong> {empleado?.nombre} {empleado?.apellido}</p>
                <p><strong>Documento:</strong> {empleado?.documento}</p>
                <p><strong>Departamento:</strong> {empleado?.nombreDepartamento || "--"}</p>
                <p><strong>Estado:</strong> {empleado?.accesoPermitido ? "Activo" : "Inactivo"}</p>
            </div>

            <div className="credencial-qr-wrap">
                {qrUrl ? (
                    <img src={qrUrl} alt="Código QR de credencial corporativa" />
                ) : (
                    <p>No hay QR disponible.</p>
                )}
            </div>

            <div className="credencial-actions">
                <button
                    type="button"
                    className="btn-primary"
                    onClick={onDescargar}
                    disabled={!qrUrl}
                >
                    Descargar
                </button>

                <button
                    type="button"
                    className="btn-secondary"
                    onClick={onImprimir}
                    disabled={!qrUrl}
                >
                    Imprimir
                </button>
            </div>
        </div>
    );
}

export default CredencialDigitalCard;
