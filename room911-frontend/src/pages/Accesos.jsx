import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaBuilding,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
    FaCloud,
    FaDatabase,
    FaServer,
    FaQrcode
} from "react-icons/fa";

import jsQR from "jsqr";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "../styles/Accesos.css";

const ESTADOS = {
    ESPERANDO: "esperando",
    LEYENDO: "leyendo_qr",
    VERIFICANDO: "verificando",
    CONCEDIDO: "acceso_concedido",
    DENEGADO: "acceso_denegado",
    ERROR: "error_conexion"
};

function Accesos() {

    const [estado, setEstado] = useState(ESTADOS.ESPERANDO);

    const [horaActual, setHoraActual] = useState(new Date());


    const [resultado, setResultado] = useState(null);

    const [mensajeEstado, setMensajeEstado] = useState(
        "Esperando lectura de credencial..."
    );

    const [intentos, setIntentos] = useState(0);

    const fileInputRef = useRef(null);
    const [previewQr, setPreviewQr] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        const intervalo = setInterval(() => {
            setHoraActual(new Date());
        }, 1000);

        return () => clearInterval(intervalo);

    }, []);

    const claseEstado = useMemo(() => {

        switch (estado) {

            case ESTADOS.CONCEDIDO:
                return "ok";

            case ESTADOS.DENEGADO:
                return "denegado";

            case ESTADOS.ERROR:
                return "error";

            case ESTADOS.LEYENDO:
            case ESTADOS.VERIFICANDO:
                return "cargando";

            default:
                return "espera";

        }

    }, [estado]);

    const obtenerIconoEstado = () => {

        switch (estado) {

            case ESTADOS.CONCEDIDO:
                return <FaCheckCircle />;

            case ESTADOS.DENEGADO:
                return <FaTimesCircle />;

            case ESTADOS.ERROR:
                return <FaExclamationTriangle />;

            default:
                return <FaClock />;

        }

    };

    const procesarRespuesta = (data) => {

        setResultado(data);

        if (data?.permitido) {

            setEstado(ESTADOS.CONCEDIDO);
            setMensajeEstado("Acceso autorizado");

            navigate('/acceso-concedido', {
                state: {
                    nombre: data.nombreEmpleado,
                    departamento: data.departamento,
                    hora: new Date().toLocaleTimeString()
                }
            });

        } else {

            setEstado(ESTADOS.DENEGADO);
            setMensajeEstado("Acceso denegado");

            navigate('/acceso-denegado', {
                state: {
                    nombre: data.nombreEmpleado || data.documento || "--",
                    departamento: data.departamento || "--",
                    hora: new Date().toLocaleTimeString(),
                    motivo: data.mensaje
                }
            });

        }

    };


    const leerQr = (archivo) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    try {
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0, img.width, img.height);

                        const imageData = ctx.getImageData(0, 0, img.width, img.height);
                        const code = jsQR(imageData.data, imageData.width, imageData.height, {
                            inversionAttempts: "attemptBoth",
                        });

                        if (code && code.data) {
                            console.log("codigoQr decoded:", code.data);
                            resolve(code.data);
                        } else {
                            reject(new Error("No se encontró código QR en la imagen."));
                        }
                    } catch (err) {
                        reject(new Error("Error al procesar los píxeles de la imagen."));
                    }
                };
                img.onerror = () => reject(new Error("Error al cargar la imagen seleccionada."));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error("Error al leer el archivo."));
            reader.readAsDataURL(archivo);
        });
    };

    // Simplified: the QR contains only the documento string. No heuristics.
    const obtenerDocumentoDesdeQr = async (codigoRaw) => {
        if (!codigoRaw) return "";
        return codigoRaw.trim();
    };

    const procesarImagenQr = async (event) => {

        const archivo = event.target.files?.[0];

        if (!archivo) return;
        setPreviewQr(URL.createObjectURL(archivo));

        setEstado(ESTADOS.LEYENDO);
        setMensajeEstado("Leyendo código QR...");

        setIntentos(prev => prev + 1);

        try {

            const codigoQr = await leerQr(archivo);
            console.log("codigoQr (from leerQr):", codigoQr);

            setEstado(ESTADOS.VERIFICANDO);
            setMensajeEstado("Verificando credencial en el servidor...");

            // Per specification: QR contains only documento
            const documentoFinal = (codigoQr || "").trim();

            if (!documentoFinal) {
                throw new Error('QR vacío o inválido');
            }

            // Call existing backend endpoint POST /api/acceso
            const response = await api.post("/acceso", {
                documento: documentoFinal
            });

            procesarRespuesta(response.data);

        } catch (error) {

            console.error(error);

            setEstado(ESTADOS.ERROR);

            setMensajeEstado(
                "No fue posible procesar el código QR."
            );

            // Redirect to denied screen with reason
            try {
                navigate('/acceso-denegado', {
                    state: {
                        nombre: "Empleado no identificado",
                        departamento: "--",
                        hora: new Date().toLocaleTimeString(),
                        motivo: error?.message || 'QR inválido'
                    }
                });
            } catch (navErr) {
                // ignore
            }

        } finally {

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

        }

    };

    const reiniciar = () => {

        setEstado(ESTADOS.ESPERANDO);
        setMensajeEstado("Esperando lectura de credencial...");
        setResultado(null);
        setPreviewQr(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (

        <>
            <Sidebar />

            <div className="acceso-container">

                <header className="kiosko-header">

                    <h1>ROOM_911</h1>

                    <p>Laboratorio de Acceso Restringido</p>

                    <div className="kiosko-topbar">

                        <span>

                            <FaBuilding />

                            Sistema Activo

                        </span>

                        <span>

                            <FaClock />

                            {horaActual.toLocaleTimeString()}

                        </span>

                    </div>

                </header>

                <section className={`kiosko-estado ${claseEstado}`}>

                    <div className="estado-icono">

                        {obtenerIconoEstado()}

                    </div>

                    <div className="estado-texto">

                        <h2>

                            Estado del sistema

                        </h2>

                        <p>

                            {mensajeEstado}

                        </p>

                        <small>

                            Intentos realizados:

                            <strong>

                                {" "}

                                {intentos}

                            </strong>

                        </small>

                    </div>

                </section>

                <section className="kiosko-inputs">

                    <div className="kiosko-bloque">

                        <h3>

                            <FaQrcode />

                            Escanear QR

                        </h3>

                        <label
                            htmlFor="archivoQr"
                            className="upload-area"
                        >

                            {previewQr ? (
                                <img
                                    src={previewQr}
                                    alt="Vista previa del QR"
                                    className="preview-qr"
                                />

                            ) : (

                                <>
                                    <FaQrcode size={42} />

                                    <strong>
                                        Seleccionar imagen QR
                                    </strong>

                                    <small className="upload-text">
                                        Haga clic aquí para seleccionar la imagen del código QR.
                                    </small>
                                </>

                            )}

                        </label>

                        <input

                            id="archivoQr"

                            ref={fileInputRef}

                            type="file"

                            accept="image/png,image/jpeg,image/webp"

                            hidden

                            onChange={procesarImagenQr}

                        />

                    </div>

                </section>

                {resultado && (

                    <section className="kiosko-resultado">

                        <div
                            className={
                                resultado.permitido
                                    ? "badge-acceso permitido"
                                    : "badge-acceso denegado"
                            }
                        >
                            {resultado.permitido
                                ? "✔ ACCESO AUTORIZADO"
                                : "✖ ACCESO DENEGADO"}
                        </div>

                        <div className="resultado-grid">

                            <div>
                                <strong>Empleado</strong>
                                <p>{resultado.nombreEmpleado ?? "--"}</p>
                            </div>

                            <div>
                                <strong>Documento</strong>
                                <p>{resultado.documento ?? "--"}</p>
                            </div>

                            <div>
                                <strong>Departamento</strong>
                                <p>{resultado.departamento ?? "--"}</p>
                            </div>

                            <div>
                                <strong>Cargo</strong>
                                <p>{resultado.cargo ?? "--"}</p>
                            </div>

                            <div>
                                <strong>Estado</strong>
                                <p>
                                    {resultado.activo
                                        ? "🟢 Activo"
                                        : "🔴 Inactivo"}
                                </p>
                            </div>

                            <div>
                                <strong>Hora</strong>
                                <p>{horaActual.toLocaleTimeString()}</p>
                            </div>

                        </div>

                        <div className="mensaje-final">

                            <strong>Resultado</strong>

                            <p>{resultado.mensaje}</p>

                        </div>

                    </section>

                )}

                <div className="acciones-kiosko">

                    <button
                        className="btn-secondary"
                        onClick={reiniciar}
                    >
                        Reiniciar lector
                    </button>

                </div>

                <footer className="kiosko-footer">

                    <span>
                        <FaServer />
                        API Conectada
                    </span>

                    <span>
                        <FaDatabase />
                        PostgreSQL
                    </span>

                    <span>
                        <FaCloud />
                        ROOM_911 | Laboratorio XYZ
                    </span>
                </footer>
            </div>
        </>
    );
}
export default Accesos;