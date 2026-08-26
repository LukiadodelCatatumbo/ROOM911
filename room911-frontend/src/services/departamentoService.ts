import api from "./api";
import { Department } from "../types";
import { MOCK_DEPARTAMENTOS } from "../data/mockData";

export const departamentoService = {
  async listar(): Promise<Department[]> {
    try {
      const response = await api.get("/departamentos");
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          codigo: d.codigo || `DPT-${d.id}`,
          nombre: d.nombre,
          descripcion: d.descripcion || "Área operativa de planta",
          responsable: d.responsable || "Supervisor a cargo",
          nivelRestriccion: d.nivelRestriccion || "MEDIA",
          totalEmpleados: d.totalEmpleados || d.empleadosCount || 10,
          empleadosCount: d.empleadosCount || d.totalEmpleados || 10,
          capacidadMaxima: d.capacidadMaxima || 50,
          color: d.color || "#0B5FA5",
          activo: d.activo ?? true,
        }));
      }
      return MOCK_DEPARTAMENTOS.map(d => ({
        ...d,
        empleadosCount: d.empleadosCount || d.totalEmpleados || 10,
        totalEmpleados: d.totalEmpleados || d.empleadosCount || 10,
      }));
    } catch {
      return MOCK_DEPARTAMENTOS.map(d => ({
        ...d,
        empleadosCount: d.empleadosCount || d.totalEmpleados || 10,
        totalEmpleados: d.totalEmpleados || d.empleadosCount || 10,
      }));
    }
  },

  async listarTodos(): Promise<Department[]> {
    return this.listar();
  },

  async guardar(dept: Partial<Department>): Promise<Department> {
    try {
      const payload = {
        nombre: dept.nombre || "Nuevo Departamento",
        descripcion: dept.descripcion || "Área operativa de planta",
      };
      const response = await api.post("/departamentos", payload);
      const d = response.data;
      return {
        id: d.id,
        codigo: `DPT-${String(d.id).padStart(3, "0")}`,
        nombre: d.nombre,
        descripcion: d.descripcion,
        responsable: dept.responsable || "Supervisor",
        nivelRestriccion: dept.nivelRestriccion || "MEDIA",
        totalEmpleados: d.totalEmpleados ?? 0,
        empleadosCount: d.totalEmpleados ?? 0,
        capacidadMaxima: dept.capacidadMaxima || 50,
        color: dept.color || "#0B5FA5",
        activo: d.activo ?? true,
      };
    } catch {
      const created: Department = {
        id: Math.floor(Math.random() * 1000 + 10),
        codigo: dept.codigo || "NEW",
        nombre: dept.nombre || "Nuevo Departamento",
        descripcion: dept.descripcion || "Área agregada al sistema",
        responsable: dept.responsable || "Supervisor",
        nivelRestriccion: dept.nivelRestriccion || "MEDIA",
        totalEmpleados: 0,
        empleadosCount: 0,
        capacidadMaxima: dept.capacidadMaxima || 50,
        color: dept.color || "#0B5FA5",
        activo: true,
      };
      MOCK_DEPARTAMENTOS.push(created);
      return created;
    }
  },

  async crear(dept: Partial<Department>): Promise<Department> {
    return this.guardar(dept);
  },

  async actualizar(id: number | string, dept: Partial<Department>): Promise<Department> {
    try {
      const dbId = typeof id === "number" ? id : parseInt(String(id), 10) || 1;
      const payload = {
        nombre: dept.nombre,
        descripcion: dept.descripcion,
      };
      const response = await api.put(`/departamentos/${dbId}`, payload);
      return response.data;
    } catch {
      const idx = MOCK_DEPARTAMENTOS.findIndex(d => String(d.id) === String(id));
      if (idx !== -1) {
        MOCK_DEPARTAMENTOS[idx] = {
          ...MOCK_DEPARTAMENTOS[idx],
          ...dept,
        };
        return MOCK_DEPARTAMENTOS[idx];
      }
      return {
        ...MOCK_DEPARTAMENTOS[0],
        ...dept,
      } as Department;
    }
  },

  async cambiarEstado(id: number | string, nuevoEstado: boolean): Promise<Department> {
    return this.actualizar(id, { activo: nuevoEstado });
  },

  async eliminar(id: number | string): Promise<void> {
    try {
      const dbId = typeof id === "number" ? id : parseInt(String(id), 10) || 1;
      await api.delete(`/departamentos/${dbId}`);
    } catch {
      await this.cambiarEstado(id, false);
    }
  },
};
