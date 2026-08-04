import { useMemo, useRef, useState } from "react";
import api from "../services/api";

const TAMANIO_MAXIMO_BYTES = 5 * 1024 * 1024;
const COLUMNAS_REQUERIDAS = [
    "documento",
    "nombre",
    "apellido",
    "correo",
    "cargo",
    "departamentoid",
    "accesopermitido"
];

const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EmpleadoCsvImport({ departamentos, onCerrar, onImportado }) {

    const inputRef = useRef(null);

    const [dragActivo, setDragActivo] = useState(false);
    const [procesandoArchivo, setProcesandoArchivo] = useState(false);
    const [importando, setImportando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [errorArchivo, setErrorArchivo] = useState("");
    const [progreso, setProgreso] = useState(0);
    const [nombreArchivo, setNombreArchivo] = useState("");
    const [registrosProcesados, setRegistrosProcesados] = useState([]);
    const [rechazadosImportacion, setRechazadosImportacion] = useState([]);
    const [exitoFinal, setExitoFinal] = useState("");

    const departamentosActivos = useMemo(() => {
        return new Set(
            departamentos
                .filter((dep) => dep.activo)
                .map((dep) => Number(dep.id))
        );
    }, [departamentos]);

    const resumen = useMemo(() => {
        const validos = registrosProcesados.filter((r) => r.valido).length;
        const erroresLocales = registrosProcesados.filter((r) => !r.valido).length;
        const erroresImportacion = rechazadosImportacion.length;
        return {
            validos: validos - erroresImportacion,
            errores: erroresLocales + erroresImportacion
        };
    }, [registrosProcesados, rechazadosImportacion]);

    const vistaPrevia = useMemo(() => {
        return registrosProcesados.slice(0, 10);
    }, [registrosProcesados]);

    const erroresTotales = useMemo(() => {
        const erroresLocales = registrosProcesados
            .filter((fila) => !fila.valido)
            .map((fila) => ({
                linea: fila.linea,
                documento: fila.datos.documento || "-",
                motivo: fila.errores.join(" | "),
                datos: fila.datos
            }));

        const erroresCarga = rechazadosImportacion.map((fila) => ({
            linea: fila.linea,
            documento: fila.datos.documento || "-",
            motivo: fila.error,
            datos: fila.datos
        }));

        return [...erroresLocales, ...erroresCarga];
    }, [registrosProcesados, rechazadosImportacion]);

    const descargarPlantilla = () => {

        const encabezados = "documento,nombre,apellido,correo,cargo,departamentoId,accesoPermitido";
        const ejemplo = "10203040,Laura,Gomez,laura.gomez@empresa.com,Analista,1,true";
        const contenido = `${encabezados}\n${ejemplo}\n`;

        const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "plantilla_empleados.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

    };

    const limpiarEstado = () => {
        setErrorArchivo("");
        setMensaje("");
        setExitoFinal("");
        setRechazadosImportacion([]);
    };

    const parseBooleano = (valor) => {
        const texto = String(valor ?? "").trim().toLowerCase();

        if (["true", "1", "si", "sí", "yes"].includes(texto)) {
            return true;
        }

        if (["false", "0", "no"].includes(texto)) {
            return false;
        }

        return null;
    };

    const dividirCsvConComillas = (linea) => {

        const resultado = [];
        let actual = "";
        let enComillas = false;

        for (let i = 0; i < linea.length; i += 1) {
            const caracter = linea[i];

            if (caracter === "\"") {
                const esEscape = linea[i + 1] === "\"";

                if (esEscape) {
                    actual += "\"";
                    i += 1;
                } else {
                    enComillas = !enComillas;
                }

                continue;
            }

            if (caracter === "," && !enComillas) {
                resultado.push(actual);
                actual = "";
                continue;
            }

            actual += caracter;
        }

        resultado.push(actual);
        return resultado;

    };

    const validarFila = (fila) => {

        const errores = [];
        const documento = fila.documento?.trim();
        const nombre = fila.nombre?.trim();
        const apellido = fila.apellido?.trim();
        const correo = fila.correo?.trim();
        const cargo = fila.cargo?.trim();
        const departamentoIdTexto = fila.departamentoid?.trim();
        const accesoPermitidoTexto = fila.accesopermitido?.trim();

        if (!documento) errores.push("Documento requerido");
        if (!nombre) errores.push("Nombre requerido");
        if (!apellido) errores.push("Apellido requerido");
        if (!correo) errores.push("Correo requerido");
        if (!cargo) errores.push("Cargo requerido");
        if (!departamentoIdTexto) errores.push("DepartamentoId requerido");

        if (correo && !CORREO_REGEX.test(correo)) {
            errores.push("Correo inválido");
        }

        const departamentoId = Number(departamentoIdTexto);
        if (!Number.isInteger(departamentoId)) {
            errores.push("DepartamentoId debe ser entero");
        } else if (!departamentosActivos.has(departamentoId)) {
            errores.push("DepartamentoId no existe o está inactivo");
        }

        const accesoParseado = parseBooleano(accesoPermitidoTexto);
        if (accesoParseado === null) {
            errores.push("accesoPermitido debe ser true/false/1/0/si/no");
        }

        return {
            errores,
            payload: {
                documento,
                nombre,
                apellido,
                correo,
                cargo,
                departamentoId,
                accesoPermitido: accesoParseado
            }
        };

    };

    const procesarArchivo = async (archivo) => {

        limpiarEstado();
        setNombreArchivo("");
        setRegistrosProcesados([]);
        setProgreso(0);

        if (!archivo) return;

        const extensionValida = archivo.name.toLowerCase().endsWith(".csv");
        if (!extensionValida) {
            setErrorArchivo("Solo se permiten archivos con extensión .csv");
            return;
        }

        if (archivo.size > TAMANIO_MAXIMO_BYTES) {
            setErrorArchivo("El archivo supera el tamaño máximo de 5 MB");
            return;
        }

        setProcesandoArchivo(true);

        try {

            const texto = await archivo.text();
            const lineas = texto
                .split(/\r?\n/)
                .map((linea) => linea.trim())
                .filter(Boolean);

            if (lineas.length < 2) {
                setErrorArchivo("El archivo debe incluir encabezado y al menos un registro");
                return;
            }

            const encabezados = dividirCsvConComillas(lineas[0])
                .map((h) => h.trim().toLowerCase());

            const faltantes = COLUMNAS_REQUERIDAS.filter((col) => !encabezados.includes(col));
            if (faltantes.length > 0) {
                setErrorArchivo(`Faltan columnas requeridas: ${faltantes.join(", ")}`);
                return;
            }

            const filas = lineas.slice(1).map((linea, index) => {
                const celdas = dividirCsvConComillas(linea);
                const datos = {};

                encabezados.forEach((encabezado, i) => {
                    datos[encabezado] = (celdas[i] ?? "").trim();
                });

                const validacion = validarFila(datos);

                return {
                    linea: index + 2,
                    datos,
                    valido: validacion.errores.length === 0,
                    errores: validacion.errores,
                    payload: validacion.payload
                };
            });

            setNombreArchivo(archivo.name);
            setRegistrosProcesados(filas);
            setMensaje(`Archivo cargado: ${filas.length} registros detectados`);

        } catch (error) {
            console.error(error);
            setErrorArchivo("No fue posible leer el archivo CSV");
        } finally {
            setProcesandoArchivo(false);
        }

    };

    const onInputFile = (e) => {
        const archivo = e.target.files?.[0];
        procesarArchivo(archivo);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragActivo(false);
        const archivo = e.dataTransfer.files?.[0];
        procesarArchivo(archivo);
    };

    const importarRegistros = async () => {

        limpiarEstado();
        setRechazadosImportacion([]);
        setExitoFinal("");

        const candidatos = registrosProcesados.filter((fila) => fila.valido);
        if (candidatos.length === 0) {
            setMensaje("No hay registros válidos para importar");
            return;
        }

        setImportando(true);
        const rechazados = [];
        let importados = 0;

        for (let i = 0; i < candidatos.length; i += 1) {
            const fila = candidatos[i];

            try {
                await api.post("/empleados", fila.payload);
                importados += 1;
            } catch (error) {
                const mensajeError = error?.response?.data?.message
                    || error?.response?.data?.error
                    || "Error al registrar en servidor";

                rechazados.push({
                    linea: fila.linea,
                    datos: fila.datos,
                    error: mensajeError
                });
            }

            const porcentaje = Math.round(((i + 1) / candidatos.length) * 100);
            setProgreso(porcentaje);
        }

        setRechazadosImportacion(rechazados);
        setImportando(false);

        if (importados > 0) {
            onImportado();
        }

        if (rechazados.length === 0) {
            setExitoFinal(`Importación finalizada con éxito. Registros creados: ${importados}`);
        } else {
            setMensaje(
                `Importación finalizada con observaciones: ${importados} creados, ${rechazados.length} rechazados en servidor`
            );
        }

    };

    const descargarRechazados = () => {

        const filasError = erroresTotales;

        if (filasError.length === 0) {
            setMensaje("No hay registros rechazados para descargar");
            return;
        }

        const headers = "documento,nombre,apellido,correo,cargo,departamentoId,accesoPermitido,errores";
        const contenidoFilas = filasError.map((fila) => {
            const d = fila.datos;
            const valores = [
                d.documento ?? "",
                d.nombre ?? "",
                d.apellido ?? "",
                d.correo ?? "",
                d.cargo ?? "",
                d.departamentoid ?? "",
                d.accesopermitido ?? "",
                fila.motivo
            ].map((v) => `"${String(v).replaceAll("\"", "\"\"")}"`);

            return valores.join(",");
        });

        const contenido = `${headers}\n${contenidoFilas.join("\n")}`;
        const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "registros_rechazados.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

    };

    return (
        <div className="modal-overlay">
            <div className="csv-import-modal">
                <div className="csv-import-header">
                    <h2>Importación empresarial de empleados (CSV)</h2>

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onCerrar}
                    >
                        Cerrar
                    </button>
                </div>

                <p className="csv-help">
                    Estructura esperada: documento, nombre, apellido, correo, cargo,
                    departamentoId, accesoPermitido
                </p>

                <div className="csv-import-actions">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={descargarPlantilla}
                    >
                        Descargar plantilla CSV
                    </button>

                    <button
                        type="button"
                        className="btn-primary"
                        onClick={() => inputRef.current?.click()}
                    >
                        Seleccionar archivo CSV
                    </button>

                    <input
                        ref={inputRef}
                        type="file"
                        accept=".csv,text/csv"
                        onChange={onInputFile}
                        hidden
                    />
                </div>

                <div
                    className={`csv-dropzone ${dragActivo ? "activo" : ""}`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragActivo(true);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        setDragActivo(false);
                    }}
                    onDrop={onDrop}
                >
                    <p>Arrastra y suelta el archivo CSV aquí</p>
                    <small>Tamaño máximo permitido: 5 MB</small>
                </div>

                {procesandoArchivo && (
                    <p className="csv-status info">Procesando archivo...</p>
                )}

                {nombreArchivo && (
                    <p className="csv-status">
                        Archivo: <strong>{nombreArchivo}</strong>
                    </p>
                )}

                {errorArchivo && (
                    <p className="csv-status error">{errorArchivo}</p>
                )}

                {mensaje && (
                    <p className="csv-status warning">{mensaje}</p>
                )}

                {exitoFinal && (
                    <p className="csv-status success">{exitoFinal}</p>
                )}

                {registrosProcesados.length > 0 && (
                    <>
                        <div className="csv-kpis">
                            <div className="csv-kpi">
                                <span>Registros válidos</span>
                                <strong>{resumen.validos}</strong>
                            </div>

                            <div className="csv-kpi">
                                <span>Registros con errores</span>
                                <strong>{resumen.errores}</strong>
                            </div>
                        </div>

                        <div className="csv-progress">
                            <div className="csv-progress-track">
                                <div
                                    className="csv-progress-bar"
                                    style={{ width: `${progreso}%` }}
                                />
                            </div>
                            <span>{progreso}%</span>
                        </div>

                        <div className="csv-import-actions">
                            <button
                                type="button"
                                className="btn-primary"
                                disabled={importando}
                                onClick={importarRegistros}
                            >
                                {importando ? "Cargando..." : "Iniciar carga"}
                            </button>

                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={descargarRechazados}
                            >
                                Descargar rechazados CSV
                            </button>
                        </div>

                        <div className="csv-table-wrap">
                            <h3>Vista previa (primeros 10 registros)</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Línea</th>
                                        <th>Documento</th>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vistaPrevia.map((fila) => (
                                        <tr key={fila.linea}>
                                            <td>{fila.linea}</td>
                                            <td>{fila.datos.documento || "-"}</td>
                                            <td>
                                                {fila.datos.nombre || "-"} {fila.datos.apellido || ""}
                                            </td>
                                            <td>{fila.datos.correo || "-"}</td>
                                            <td>
                                                <span
                                                    className={fila.valido ? "estado-exito" : "estado-error"}
                                                >
                                                    {fila.valido ? "Válido" : "Error"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {erroresTotales.length > 0 && (
                            <div className="csv-table-wrap">
                                <h3>Tabla de errores</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Línea</th>
                                            <th>Documento</th>
                                            <th>Motivo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {erroresTotales.map((fila, index) => (
                                            <tr key={`${fila.linea}-${index}`}>
                                                <td>{fila.linea}</td>
                                                <td>{fila.documento}</td>
                                                <td>{fila.motivo}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default EmpleadoCsvImport;
