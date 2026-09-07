import api from "./api";
import { AccessEntry, AccessResult } from "../types";

export interface ValidateAccessResponse {
  permitido: boolean;
  resultado: AccessResult;
  mensaje: string;
  empleadoNombre?: string;
  empleadoId?: string;
  departamento?: string;
  puntoCodigo?: string;
  puerta?: string;
  timestamp: string;
}

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
    const response = await api.post("/acceso", { documento, puerta });
    const data = response.data;
    const permitido = data.permitido ?? (data.estado === "CONCEDIDO");
    return {
      permitido,
      resultado: (data.resultado as AccessResult) || (data.estado as AccessResult) || (permitido ? "CONCEDIDO" : "DENEGADO"),
      mensaje: data.mensaje || (permitido ? "Acceso autorizado" : "Acceso no autorizado"),
      empleadoNombre: data.nombreEmpleado || (data.empleado?.nombre ? `${data.empleado.nombre} ${data.empleado.apellido || ""}` : undefined),
      empleadoId: data.documento || data.empleado?.codigoQr || documento,
      departamento: data.departamento || data.empleado?.departamento?.nombre,
      puntoCodigo: data.puntoCodigo,
      puerta: data.puerta,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
  },

  async validarAccesoQr(codigoQr: string, puerta: string = "Torniquete A-1"): Promise<ValidateAccessResponse> {
    const response = await api.post("/acceso/qr", { codigoQr, puerta });
    const data = response.data;
    return {
      permitido: data.permitido ?? (data.estado === "CONCEDIDO"),
      resultado: (data.estado as AccessResult) || (data.permitido ? "CONCEDIDO" : "DENEGADO"),
      mensaje: data.mensaje || (data.permitido ? "Acceso autorizado" : "Acceso denegado"),
      empleadoNombre: data.nombreEmpleado || (data.empleado?.nombre ? `${data.empleado.nombre} ${data.empleado.apellido || ""}` : undefined),
      empleadoId: data.documento || data.empleado?.codigoQr || codigoQr,
      departamento: data.departamento || data.empleado?.departamento?.nombre,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
  },

  /** El backend registra los intentos en /intento-acceso; no hay endpoint alterno. */
  async listarHistorial(): Promise<AccessEntry[]> {
    const response = await api.get("/intento-acceso");
    const data = response.data;
    return data.map((d: any) => {
      const ts = d.fechaAcceso || d.fechaIngreso || d.timestamp || new Date().toISOString();
      const [fechaPart, horaPart] = ts.includes("T") ? ts.split("T") : ts.split(" ");
      const esExitoso = d.exito ?? d.accesoPermitido ?? d.permitido ?? true;
      return {
        id: d.id ? `ACC-${String(d.id).padStart(4, "0")}` : "ACC-LOG",
        dbId: d.id,
        timestamp: ts,
        fecha: fechaPart,
        hora: horaPart?.substring(0, 8),
        puerta: d.puerta || d.departamento || "—",
        resultado: (d.resultado as AccessResult) || (esExitoso ? "CONCEDIDO" : "DENEGADO"),
        motivo: d.mensaje || d.observaciones || (esExitoso ? "Validación conforme" : "Acceso denegado"),
        empleadoId: d.documento || (d.empleadoId ? `EMP-${d.empleadoId}` : undefined),
        empleadoNombre: d.nombreEmpleado,
        departamento: d.departamento,
      };
    });
  },

  async obtenerHistorialGlobal(): Promise<AccessEntry[]> {
    return this.listarHistorial();
  },

  async listarPorEmpleado(empleadoId: string | number): Promise<AccessEntry[]> {
    const response = await api.get(`/intento-acceso/empleado/${empleadoId}`);
    return response.data.map((d: any) => {
      const ts = d.fechaAcceso || d.fechaIngreso || d.timestamp || new Date().toISOString();
      const [fechaPart, horaPart] = ts.includes("T") ? ts.split("T") : ts.split(" ");
      const esExitoso = d.exito ?? d.accesoPermitido ?? d.permitido ?? true;
      return {
        id: `ACC-${d.id || "001"}`,
        dbId: d.id,
        fecha: fechaPart,
        hora: horaPart?.substring(0, 8),
        puerta: d.puerta || d.departamento || "—",
        resultado: (d.resultado as AccessResult) || (esExitoso ? "CONCEDIDO" : "DENEGADO"),
        motivo: d.mensaje || d.observaciones || (esExitoso ? "Validación conforme" : "Acceso denegado"),
        empleadoId: d.documento || String(empleadoId),
      };
    });
  },
};
