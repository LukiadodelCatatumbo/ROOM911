import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SimuladorAcceso.css";
import { validarAcceso } from "../services/accesoService";

function SimuladorAcceso() {

    const navigate = useNavigate();

    const [idEmpleado, setIdEmpleado] = useState("");
    const [estado, setEstado] = useState("esperando"); // esperando | leyendo | verificando | qrError

    const inputFileRef = useRef(null);

    const onSeleccionarImagen = (e) => {

        if (!e?.target?.files?.length) return;

        setEstado("leyendo");

        setTimeout(() => {

            setEstado("verificando");

            setTimeout(() => {

                setEstado("qrError");

                if (inputFileRef.current) {

                    inputFileRef.current.value = "";

                }

            }, 1500);

        }, 1500);

    };

    const estaCargando = estado === "leyendo" || estado === "verificando";

    return (

        <main className="simulador-page">

            <section className="simulador-card">

                <h1>

                    ROOM_911

                </h1>

                <p className="simulador-subtitle">

                    Control de acceso

                </p>

                <div className="simulador-block">

                    <label>

                        Subir imagen QR

                    </label>

                    <button

                        type="button"

                        className="btn-primary"

                        disabled={estaCargando}

                        onClick={() => inputFileRef.current?.click()}

                    >

                        Subir imagen QR

                    </button>

                    <input

                        ref={inputFileRef}

                        type="file"

                        accept="image/png,image/jpeg,image/webp"

                        hidden

                        disabled={estaCargando}

                        onChange={onSeleccionarImagen}

                    />

                </div>

                <div className="simulador-block">

                    <label htmlFor="id-empleado">

                        ID del empleado

                    </label>

                    <input

                        id="id-empleado"

                        type="text"

                        placeholder="Ingrese ID manualmente"

                        value={idEmpleado}

                        disabled={estaCargando}

                        onChange={(e) => {

                            setIdEmpleado(e.target.value);

                            if (estado === "qrError") setEstado("esperando");

                        }}

                    />

                </div>

                {estado === "leyendo" && (

                    <div
                        className="simulador-lectura-estado"
                        role="status"
                        aria-live="polite"
                    >

                        <span className="simulador-spinner"></span>

                        <p>

                            Leyendo código QR...

                        </p>

                    </div>

                )}

                {estado === "verificando" && (

                    <div
                        className="simulador-lectura-estado"
                        role="status"
                        aria-live="polite"
                    >

                        <span className="simulador-spinner"></span>

                        <p>

                            Verificando acceso...

                        </p>

                    </div>

                )}

                {estado === "qrError" && (

                    <div className="mensaje-error" role="alert">

                        No se pudo leer el código QR. Intente nuevamente o ingrese el ID manualmente.

                    </div>

                )}

                <button

                    type="button"

                    className="btn-primary simulador-btn-verificar"

                    disabled={estaCargando}

                >

                    Verificar

                </button>

            </section>

        </main>

    );

}

export default SimuladorAcceso;