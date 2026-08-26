import api from "./api";
import { Employee } from "../types";
import { MOCK_EMPLEADOS } from "../data/mockData";

export const empleadoService = {
  async listar(): Promise<Employee[]> {
    try {
      const response = await api.get("/empleados");
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        return data.map((d: any) => ({
          id: d.documento || `EMP-${String(d.id).padStart(4, "0")}`,
          dbId: d.id,
          nombre: d.nombre || "",
          apellido: d.apellido || "",
          cedula: d.documento || d.cedula || d.documentoIdentidad,
          departamento: d.nombreDepartamento || d.departamento?.nombre || (typeof d.departamento === "string" ? d.departamento : "General"),
          departamentoId: d.departamentoId || d.departamento?.id || 1,
          cargo: d.cargo || "Especialista",
          email: d.correo || d.email || `${d.nombre?.toLowerCase() || "emp"}@pharma911.com`,
          acceso: d.accesoPermitido ?? d.acceso ?? d.activo ?? true,
          permisoAcceso: d.accesoPermitido ?? d.permisoAcceso ?? true,
          activo: d.activo ?? true,
          fechaIngreso: d.fechaCreacion ? String(d.fechaCreacion).split("T")[0] : (d.fechaIngreso || "2024-01-15"),
          fechaRegistro: d.fechaCreacion ? String(d.fechaCreacion).split("T")[0] : (d.fechaRegistro || "2024-01-15"),
          codigoQr: d.documento || `EMP-${String(d.id).padStart(4, "0")}`,
          documentoIdentidad: d.documento || d.documentoIdentidad || "—",
        }));
      }
      return MOCK_EMPLEADOS;
    } catch {
      return MOCK_EMPLEADOS;
    }
  },

  async listarTodos(): Promise<Employee[]> {
    return this.listar();
  },

  async buscarPorId(id: string | number): Promise<Employee> {
    try {
      const response = await api.get(`/empleados/${id}`);
      const d = response.data;
      return {
        id: d.documento || `EMP-${String(d.id).padStart(4, "0")}`,
        dbId: d.id,
        nombre: d.nombre,
        apellido: d.apellido,
        cedula: d.documento || d.cedula || d.documentoIdentidad,
        departamento: d.nombreDepartamento || d.departamento?.nombre || (typeof d.departamento === "string" ? d.departamento : "General"),
        departamentoId: d.departamentoId || d.departamento?.id,
        cargo: d.cargo || "Especialista",
        email: d.correo || d.email,
        acceso: d.accesoPermitido ?? d.acceso ?? true,
        permisoAcceso: d.accesoPermitido ?? d.permisoAcceso ?? true,
        activo: d.activo ?? true,
        fechaIngreso: d.fechaCreacion ? String(d.fechaCreacion).split("T")[0] : (d.fechaIngreso || "2024-01-15"),
        fechaRegistro: d.fechaCreacion ? String(d.fechaCreacion).split("T")[0] : (d.fechaRegistro || "2024-01-15"),
        codigoQr: d.documento || String(id),
        documentoIdentidad: d.documento || d.documentoIdentidad,
      };
    } catch {
      const found = MOCK_EMPLEADOS.find(e => e.id === id || String(e.dbId) === String(id));
      if (found) return found;
      return MOCK_EMPLEADOS[0];
    }
  },

  async guardar(empleado: Partial<Employee>): Promise<Employee> {
    try {
      const payload = {
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        documento: empleado.cedula || empleado.documentoIdentidad || empleado.id || "00000000",
        correo: empleado.email || `${empleado.nombre?.toLowerCase() || "usuario"}@pharma911.com`,
        cargo: empleado.cargo || "Operario",
        departamentoId: Number(empleado.departamentoId) || 1,
        accesoPermitido: empleado.permisoAcceso ?? empleado.acceso ?? true,
      };
      const response = await api.post("/empleados", payload);
      const d = response.data;
      return {
        id: d.documento || `EMP-${String(d.id).padStart(4, "0")}`,
        dbId: d.id,
        nombre: d.nombre,
        apellido: d.apellido,
        cedula: d.documento,
        departamento: d.nombreDepartamento || "General",
        departamentoId: d.departamentoId,
        cargo: d.cargo,
        email: d.correo,
        acceso: d.accesoPermitido ?? true,
        permisoAcceso: d.accesoPermitido ?? true,
        activo: d.activo ?? true,
        fechaIngreso: d.fechaCreacion ? String(d.fechaCreacion).split("T")[0] : new Date().toISOString().split("T")[0],
        fechaRegistro: d.fechaCreacion ? String(d.fechaCreacion).split("T")[0] : new Date().toISOString().split("T")[0],
        codigoQr: d.documento || `EMP-${String(d.id).padStart(4, "0")}`,
      };
    } catch {
      const newEmp: Employee = {
        id: empleado.id || `EMP-0${Math.floor(Math.random() * 900 + 100)}`,
        nombre: empleado.nombre || "",
        apellido: empleado.apellido || "",
        cedula: empleado.cedula || "1020304050",
        departamento: empleado.departamento || "Producción",
        departamentoId: empleado.departamentoId || 1,
        cargo: empleado.cargo || "Operario",
        email: empleado.email || "",
        acceso: empleado.acceso ?? empleado.permisoAcceso ?? true,
        permisoAcceso: empleado.permisoAcceso ?? empleado.acceso ?? true,
        activo: true,
        fechaIngreso: new Date().toISOString().split("T")[0],
        fechaRegistro: new Date().toISOString().split("T")[0],
        codigoQr: empleado.id || `EMP-0${Math.floor(Math.random() * 900 + 100)}`,
      };
      MOCK_EMPLEADOS.unshift(newEmp);
      return newEmp;
    }
  },

  async crear(empleado: Partial<Employee>): Promise<Employee> {
    return this.guardar(empleado);
  },

  async actualizar(id: string | number, empleado: Partial<Employee>): Promise<Employee> {
    try {
      const dbId = typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10) || 1;
      const payload = {
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        documento: empleado.cedula || empleado.documentoIdentidad || "00000000",
        correo: empleado.email || "usuario@pharma911.com",
        cargo: empleado.cargo || "Operario",
        departamentoId: Number(empleado.departamentoId) || 1,
        accesoPermitido: empleado.permisoAcceso ?? empleado.acceso ?? true,
      };
      const response = await api.put(`/empleados/${dbId}`, payload);
      return response.data;
    } catch {
      const index = MOCK_EMPLEADOS.findIndex(e => e.id === id);
      if (index !== -1) {
        MOCK_EMPLEADOS[index] = {
          ...MOCK_EMPLEADOS[index],
          ...empleado,
        };
        return MOCK_EMPLEADOS[index];
      }
      return {
        ...MOCK_EMPLEADOS[0],
        ...empleado,
      } as Employee;
    }
  },

  async cambiarEstado(id: string | number, nuevoEstado: boolean): Promise<Employee> {
    return this.actualizar(id, {
      acceso: nuevoEstado,
      permisoAcceso: nuevoEstado,
      activo: nuevoEstado,
    });
  },

  async eliminar(id: string | number): Promise<void> {
    // Soft delete: toggle status
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
