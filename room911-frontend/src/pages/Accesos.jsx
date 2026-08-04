import { useEffect, useMemo, useRef, useState } from "react";
import {
    FaBuilding,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
    FaCloud,
    FaDatabase,
    FaServer,
    FaQrcode,
    FaIdCard
} from "react-icons/fa";

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

    const [documento, setDocumento] = useState("");

    const [resultado, setResultado] = useState(null);

    const [mensajeEstado, setMensajeEstado] = useState(
        "Esperando lectura de credencial..."
    );

    const [intentos, setIntentos] = useState(0);

    const inputDocumento = useRef(null);
    const fileInputRef = useRef(null);
    const [previewQr, setPreviewQr] = useState(null);

    useEffect(() => {

        const intervalo = setInterval(() => {
            setHoraActual(new Date());
        }, 1000);

        return () => clearInterval(intervalo);

    }, []);

    useEffect(() => {
        inputDocumento.current?.focus();
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

        } else {

            setEstado(ESTADOS.DENEGADO);
            setMensajeEstado("Acceso denegado");

        }

    };

    const validarDocumento = async (valorDocumento) => {

        setEstado(ESTADOS.VERIFICANDO);
        setMensajeEstado("Verificando acceso...");

        setIntentos(prev => prev + 1);

        try {

            const response = await api.post("/acceso", {
                documento: valorDocumento
            });

            procesarRespuesta(response.data);

            setDocumento("");

            inputDocumento.current?.focus();

        } catch (error) {

            console.error(error);

            setEstado(ESTADOS.ERROR);

            setMensajeEstado(
                "Error de conexión con el servidor."
            );

        }

    };

    const validarManual = async () => {

        if (!documento.trim()) {

            alert("Ingrese un documento.");

            return;

        }

        await validarDocumento(documento.trim());

    };

    const leerQr = async (archivo) => {

        if (!("BarcodeDetector" in window)) {

            throw new Error(
                "BarcodeDetector no soportado."
            );

        }

        const detector = new window.BarcodeDetector({

            formats: ["qr_code"]

        });

        const bitmap = await createImageBitmap(archivo);

        const codigos = await detector.detect(bitmap);

        if (!codigos.length) {

            throw new Error("No se encontró QR.");

        }

        return codigos[0].rawValue;

    };

    const extraerDocumentoDeQr = (codigoRaw) => {
        if (!codigoRaw) return "";
        const texto = codigoRaw.trim();
        if (texto.startsWith("http://") || texto.startsWith("https://")) {
            try {
                const url = new URL(texto);
                const segmentos = url.pathname.split("/").filter(Boolean);
                if (segmentos.length > 0) {
                    return decodeURIComponent(segmentos[segmentos.length - 1]);
                }
            } catch (e) {
                const partes = texto.split("/");
                return partes[partes.length - 1];
            }
        }
        return texto;
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
            const valorExtraido = extraerDocumentoDeQr(codigoQr);

            setEstado(ESTADOS.VERIFICANDO);
            setMensajeEstado("Verificando credencial en el servidor...");

            const response = await api.post("/acceso", {
                documento: valorExtraido
            });

            procesarRespuesta(response.data);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setDocumento("");

        } catch (error) {

            console.error(error);

            setEstado(ESTADOS.ERROR);

            setMensajeEstado(
                "No fue posible leer el código QR."
            );

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
        setDocumento("");
        setPreviewQr(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        inputDocumento.current?.focus();
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

                            <FaIdCard />

                            Documento

                        </h3>

                        <div className="kiosko-manual">

                            <input

                                ref={inputDocumento}

                                type="text"

                                placeholder="Documento del empleado"

                                value={documento}

                                onChange={(e) =>
                                    setDocumento(e.target.value)
                                }

                                onKeyDown={(e) => {

                                    if (e.key === "Enter") {

                                        e.preventDefault();

                                        validarManual();

                                    }

                                }}

                            />

                            <button

                                className="btn-primary"

                                onClick={validarManual}

                            >

                                Verificar

                            </button>

                        </div>

                    </div>

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