import api from "../services/api";

function blobToDataURL(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
    });
}

/**
 * Carga la imagen QR del empleado.
 * Intenta primero desde el backend y si el endpoint no existe (404), genera el código QR
 * dinámicamente mediante la API de QRServer y la devuelve como Data URL en Base64.
 */
export async function cargarQrDataUrl(empleado) {
    if (!empleado) return null;

    const empleadoId = typeof empleado === "object" ? empleado.id : empleado;
    // QR must contain only the employee documento (per ROOM_911 requirement)
    const valorQr = typeof empleado === "object"
        ? String(empleado.documento || "")
        : String(empleado);

    // 1. Intentar llamada al backend por si existe el endpoint de QR
    if (empleadoId) {
        try {
            const response = await api.get(`/empleados/${empleadoId}/qr`, {
                responseType: "blob"
            });
            if (response.data && response.data.size > 0) {
                const blob = new Blob([response.data], {
                    type: response.headers["content-type"] || "image/png"
                });
                const dataUrl = await blobToDataURL(blob);
                if (dataUrl) return dataUrl;
            }
        } catch {
            // El backend no dispone del endpoint /qr (HTTP 404), procedemos al generador dinámico
        }
    }

    // 2. Generar QR mediante servicio público QR y convertir a Data URL Base64
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(valorQr)}`;

    try {
        const res = await fetch(qrApiUrl);
        if (res.ok) {
            const blob = await res.blob();
            const dataUrl = await blobToDataURL(blob);
            if (dataUrl) return dataUrl;
        }
    } catch (err) {
        console.error("Error al convertir QR a Data URL:", err);
    }

    return qrApiUrl;
}

/**
 * Descarga el código QR como imagen PNG válida.
 */
export async function descargarQrPng(empleado, existingDataUrl = null) {
    let dataUrl = existingDataUrl;
    if (!dataUrl && empleado) {
        dataUrl = await cargarQrDataUrl(empleado);
    }

    if (!dataUrl) {
        alert("No fue posible obtener el código QR para descargar.");
        return;
    }

    // Si es un dataUrl o Blob URL, descargarlo directamente
    const docId = typeof empleado === "object" ? (empleado.documento || empleado.id) : empleado;
    const link = document.createElement("a");

    if (dataUrl.startsWith("data:") || dataUrl.startsWith("blob:")) {
        link.href = dataUrl;
        link.download = `QR_${docId || "empleado"}.png`;
    } else {
        // Si es URL remota, convertir primero a Blob
        try {
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            const objectUrl = URL.createObjectURL(blob);
            link.href = objectUrl;
            link.download = `QR_${docId || "empleado"}.png`;
        } catch {
            link.href = dataUrl;
            link.download = `QR_${docId || "empleado"}.png`;
        }
    }

    document.body.appendChild(link);
    link.click();
    link.remove();
}

/**
 * Abre la ventana de impresión para guardar como PDF o imprimir la credencial con QR.
 */
export async function imprimirQrPdf(empleado, existingDataUrl = null) {
    let dataUrl = existingDataUrl;
    if (!dataUrl && empleado) {
        dataUrl = await cargarQrDataUrl(empleado);
    }

    if (!dataUrl) {
        alert("No fue posible obtener el código QR para imprimir.");
        return;
    }

    const empObj = typeof empleado === "object" ? empleado : { id: empleado };

    const ventana = window.open("", "_blank", "width=900,height=700");
    if (!ventana) return;

    ventana.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8"/>
                <title>QR Empleado - ${empObj?.nombre || ""} ${empObj?.apellido || ""}</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        background: #F7F8FA;
                        margin: 0;
                        padding: 40px;
                        color: #0F172A;
                    }
                    .card {
                        width: 420px;
                        margin: auto;
                        background: white;
                        border: 1px solid #D8DCE1;
                        border-radius: 12px;
                        padding: 24px;
                        text-align: center;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    }
                    h2 {
                        color: #0B5FA5;
                        margin-top: 0;
                        margin-bottom: 20px;
                    }
                    p {
                        margin: 8px 0;
                        font-size: 15px;
                        text-align: left;
                    }
                    .qr-container {
                        margin-top: 20px;
                        text-align: center;
                    }
                    img {
                        width: 230px;
                        height: 230px;
                        border: 1px solid #D8DCE1;
                        border-radius: 8px;
                        padding: 10px;
                        background: #fff;
                    }
                </style>
            </head>
            <body>
                <div class="card">
                    <h2>Código QR de Empleado</h2>
                    <p><strong>Nombre:</strong> ${empObj?.nombre || ""} ${empObj?.apellido || ""}</p>
                    <p><strong>Documento:</strong> ${empObj?.documento || "--"}</p>
                    <p><strong>Departamento:</strong> ${empObj?.nombreDepartamento || "--"}</p>
                    <p><strong>ID:</strong> ${empObj?.id || "--"}</p>
                    <div class="qr-container">
                        <img id="qrImage" src="${dataUrl}" alt="QR Empleado" />
                    </div>
                </div>
                <script>
                    const img = document.getElementById("qrImage");
                    if (img && img.complete) {
                        window.focus();
                        window.print();
                    } else if (img) {
                        img.onload = function() {
                            window.focus();
                            window.print();
                        };
                    }
                </script>
            </body>
        </html>
    `);

    ventana.document.close();
}
