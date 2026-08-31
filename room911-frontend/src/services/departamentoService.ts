import api from "./api";
import { Department } from "../types";

interface DepartamentoBackend {
  id: number;
  nombre: string;
  codigo?: string;
  descripcion?: string;
  responsable?: string;
  nivelRestriccion?: string;
  capacidadMaxima?: number;
  empleadosCount?: number;
  activo?: boolean;
}

const mapDepartamento = (d: DepartamentoBackend): Department => ({
  id: d.id,
  codigo: d.codigo || `DPT-${String(d.id).padStart(3, "0")}`,
  nombre: d.nombre,
  descripcion: d.descripcion,
  responsable: d.responsable,
  nivelRestriccion: (d.nivelRestriccion as Department["nivelRestriccion"]) || "MEDIA",
  totalEmpleados: d.empleadosCount ?? 0,
  empleadosCount: d.empleadosCount ?? 0,
  capacidadMaxima: d.capacidadMaxima ?? 50,
  activo: d.activo ?? true,
});

export const departamentoService = {
  async listar(): Promise<Department[]> {
    const response = await api.get<DepartamentoBackend[]>("/departamentos");
    return response.data.map(mapDepartamento);
  },

  async listarTodos(): Promise<Department[]> {
    return this.listar();
  },

  async crear(dept: Partial<Department>): Promise<Department> {
    const payload = {
      nombre: dept.nombre,
      codigo: dept.codigo,
      descripcion: dept.descripcion,
      responsable: dept.responsable,
      nivelRestriccion: dept.nivelRestriccion,
      capacidadMaxima: dept.capacidadMaxima,
    };
    const response = await api.post<DepartamentoBackend>("/departamentos", payload);
    return mapDepartamento(response.data);
  },

  async guardar(dept: Partial<Department>): Promise<Department> {
    return this.crear(dept);
  },

  async actualizar(id: number | string, dept: Partial<Department>): Promise<Department> {
    const payload = {
      nombre: dept.nombre,
      codigo: dept.codigo,
      descripcion: dept.descripcion,
      responsable: dept.responsable,
      nivelRestriccion: dept.nivelRestriccion,
      capacidadMaxima: dept.capacidadMaxima,
    };
    const response = await api.put<DepartamentoBackend>(`/departamentos/${id}`, payload);
    return mapDepartamento(response.data);
  },

  /**
   * El estado se controla con los endpoints dedicados del backend:
   * deshabilitar -> DELETE (borrado lógico), reactivar -> PATCH /activar.
   */
  async cambiarEstado(id: number | string, nuevoEstado: boolean): Promise<void> {
    if (nuevoEstado) {
      await api.patch(`/departamentos/${id}/activar`);
    } else {
      await api.delete(`/departamentos/${id}`);
    }
  },

  async eliminar(id: number | string): Promise<void> {
    await api.delete(`/departamentos/${id}`);
  },
};
