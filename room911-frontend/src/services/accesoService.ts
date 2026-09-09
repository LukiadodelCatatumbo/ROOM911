import api from "./api";
import { AccessEntry, AccessResult, ValidateAccessResponse } from "../types";

/** AccessResponseDTO del backend (POST /api/acceso y /api/acceso/qr). */
interface AccessResponseBackend {
  permitido: boolean;
  resultado?: string;
  mensaje?: string;
  nombreEmpleado?: string;
  documento?: string;
  cargo?: string;
  departamento?: string;
  activo?: boolean;
  puntoCodigo?: string;
  puerta?: string;
}

/** AccessAttemptDTO del backend (GET /intento-acceso). */
interface AccessAttemptBackend {
  id?: number;
  fechaAcceso?: string;
  exito?: boolean;
  mensaje?: string;
  documento?: string;
  empleadoId?: number;
  nombreEmpleado?: string;
  departamento?: string;
}

const partirTimestamp = (ts: string): { fecha?: string; hora?: string } => {
  const [fechaPart, horaPart] = ts.includes("T") ? ts.split("T") : ts.split(" ");
  return { fecha: fechaPart, hora: horaPart?.substring(0, 8) };
};

const mapearIntento = (d: AccessAttemptBackend): AccessEntry => {
  const ts = d.fechaAcceso || new Date().toISOString();
  const { fecha, hora } = partirTimestamp(ts);
  const esExitoso = d.exito ?? false;
  return {
    id: d.id ? `ACC-${String(d.id).padStart(4, "0")}` : "ACC-LOG",
    dbId: d.id,
    timestamp: ts,
    fecha,
    hora,
    puerta: d.departamento || "—",
    resultado: (esExitoso ? "CONCEDIDO" : "DENEGADO") as AccessResult,
    motivo: d.mensaje || (esExitoso ? "Validación conforme" : "Acceso denegado"),
    empleadoId: d.documento || (d.empleadoId ? `EMP-${d.empleadoId}` : undefined),
    empleadoNombre: d.nombreEmpleado,
    departamento: d.departamento,
  };
};

export const accesoService = {
  /** Descarga el historial del empleado en PDF (GET /intento-acceso/pdf/{id}). */
  async descargarPdf(empleadoId: string | number): Promise<void> {
    const response = await api.get(`/intento-acceso/pdf/${empleadoId}`, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(response.data);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = `historial_${empleadoId}.pdf`;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
  },

  /** Valida contra el servidor (fuente autoritativa: punto, horario y zona). */
  async validarAcceso(documento: string, puerta: string = "Puerta Principal"): Promise<ValidateAccessResponse> {
    const response = await api.post<AccessResponseBackend>("/acceso", { documento, puerta });
    const data = response.data;
    return {
      permitido: data.permitido,
      resultado: (data.resultado as AccessResult) || (data.permitido ? "CONCEDIDO" : "DENEGADO"),
      mensaje: data.mensaje || (data.permitido ? "Acceso autorizado" : "Acceso no autorizado"),
      empleadoNombre: data.nombreEmpleado,
      empleadoId: data.documento || documento,
      departamento: data.departamento,
      puntoCodigo: data.puntoCodigo,
      puerta: data.puerta,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
  },

  async validarAccesoQr(codigoQr: string, puerta: string = "Torniquete A-1"): Promise<ValidateAccessResponse> {
    const response = await api.post<AccessResponseBackend>("/acceso/qr", { codigoQr, puerta });
    const data = response.data;
    return {
      permitido: data.permitido,
      resultado: (data.resultado as AccessResult) || (data.permitido ? "CONCEDIDO" : "DENEGADO"),
      mensaje: data.mensaje || (data.permitido ? "Acceso autorizado" : "Acceso denegado"),
      empleadoNombre: data.nombreEmpleado,
      empleadoId: data.documento || codigoQr,
      departamento: data.departamento,
      puntoCodigo: data.puntoCodigo,
      puerta: data.puerta,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
  },

  /** El backend registra los intentos en /intento-acceso; no hay endpoint alterno. */
  async listarHistorial(): Promise<AccessEntry[]> {
    const response = await api.get<AccessAttemptBackend[]>("/intento-acceso");
    return response.data.map(mapearIntento);
  },

  async obtenerHistorialGlobal(): Promise<AccessEntry[]> {
    return this.listarHistorial();
  },

  async listarPorEmpleado(empleadoId: string | number): Promise<AccessEntry[]> {
    const response = await api.get<AccessAttemptBackend[]>(`/intento-acceso/empleado/${empleadoId}`);
    return response.data.map(mapearIntento);
  },
};
