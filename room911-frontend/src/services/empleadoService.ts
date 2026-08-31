import api from "./api";
import { Employee } from "../types";

const fechaDe = (valor?: string) =>
  valor ? String(valor).split("T")[0] : undefined;

const mapEmpleado = (d: any): Employee => ({
  id: d.documento || `EMP-${String(d.id).padStart(4, "0")}`,
  dbId: d.id,
  nombre: d.nombre || "",
  apellido: d.apellido || "",
  cedula: d.documento || d.documentoIdentidad,
  departamento:
    d.nombreDepartamento ||
    d.departamento?.nombre ||
    (typeof d.departamento === "string" ? d.departamento : "Sin asignar"),
  departamentoId: d.departamentoId || d.departamento?.id,
  cargo: d.cargo || "",
  email: d.correo || "",
  acceso: d.accesoPermitido ?? d.acceso ?? true,
  permisoAcceso: d.accesoPermitido ?? d.permisoAcceso ?? true,
  activo: d.activo ?? true,
  fechaIngreso: fechaDe(d.fechaCreacion) || d.fechaIngreso,
  fechaRegistro: fechaDe(d.fechaCreacion) || d.fechaRegistro,
  codigoQr: d.documento || `EMP-${String(d.id).padStart(4, "0")}`,
  documentoIdentidad: d.documento || d.documentoIdentidad,
});

const toPayload = (empleado: Partial<Employee>) => ({
  nombre: empleado.nombre,
  apellido: empleado.apellido,
  documento: empleado.cedula || empleado.documentoIdentidad,
  correo: empleado.email,
  cargo: empleado.cargo,
  departamentoId: empleado.departamentoId ? Number(empleado.departamentoId) : undefined,
  accesoPermitido: empleado.permisoAcceso ?? empleado.acceso ?? true,
});

/** El backend expone rutas por id numérico (PK); dbId es la referencia confiable. */
const idNumerico = (id: string | number, dbId?: number): number => {
  if (dbId != null) return dbId;
  const parsed =
    typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10);
  if (Number.isNaN(parsed)) {
    throw new Error("Identificador de empleado no válido");
  }
  return parsed;
};

export const empleadoService = {
  async listar(): Promise<Employee[]> {
    const response = await api.get("/empleados");
    return response.data.map(mapEmpleado);
  },

  async listarTodos(): Promise<Employee[]> {
    return this.listar();
  },

  async buscarPorId(id: string | number): Promise<Employee> {
    const response = await api.get(`/empleados/${id}`);
    return mapEmpleado(response.data);
  },

  async guardar(empleado: Partial<Employee>): Promise<Employee> {
    const response = await api.post("/empleados", toPayload(empleado));
    return mapEmpleado(response.data);
  },

  async crear(empleado: Partial<Employee>): Promise<Employee> {
    return this.guardar(empleado);
  },

  async actualizar(id: string | number, empleado: Partial<Employee>): Promise<Employee> {
    const dbId = idNumerico(id, empleado.dbId);
    const response = await api.put(`/empleados/${dbId}`, toPayload(empleado));
    return mapEmpleado(response.data);
  },

  async cambiarEstado(id: string | number, nuevoEstado: boolean): Promise<Employee> {
    // El PUT exige el DTO completo: se recupera el empleado y se reenvía con el permiso alternado
    const dbId = idNumerico(id);
    const actual = await this.buscarPorId(dbId);
    return this.actualizar(dbId, {
      ...actual,
      permisoAcceso: nuevoEstado,
      acceso: nuevoEstado,
      activo: nuevoEstado,
    });
  },

  async eliminar(id: string | number): Promise<void> {
    // Borrado lógico: desactiva el acceso del empleado
    await this.cambiarEstado(id, false);
  },

  async importarCSV(departamentoId: number, archivo: File): Promise<string> {
    const formData = new FormData();
    formData.append("archivo", archivo);
    const response = await api.post(`/empleados/importar/${departamentoId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
