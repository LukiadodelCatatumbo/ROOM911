import api from "./api";
import { AdminUser } from "../types";
import { MOCK_ADMINS } from "../data/mockData";

export const adminService = {
  async listar(): Promise<AdminUser[]> {
    try {
      let response;
      try {
        response = await api.get("/administradores");
      } catch {
        response = await api.get("/admin");
      }
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        return data.map((d: any) => ({
          id: `ADM-${String(d.id || "001").padStart(3, "0")}`,
          dbId: d.id,
          username: d.usuario || d.username || "admin",
          nombre: d.nombre ? `${d.nombre} ${d.apellido || ""}`.trim() : (d.username || "Admin"),
          email: d.correo || d.email || `${d.usuario || d.username || "admin"}@pharma911.com`,
          rol: d.rol || "ADMIN_ACCESOS",
          ultimoAcceso: d.fechaCreacion ? `Creado: ${String(d.fechaCreacion).split("T")[0]}` : "Hoy, 09:14:22",
          activo: d.activo ?? true,
        }));
      }
      return MOCK_ADMINS.map(a => ({
        ...a,
        username: a.username || (a.email?.split("@")[0]) || "admin",
        activo: a.activo ?? true,
      }));
    } catch {
      return MOCK_ADMINS.map(a => ({
        ...a,
        username: a.username || (a.email?.split("@")[0]) || "admin",
        activo: a.activo ?? true,
      }));
    }
  },

  async listarTodos(): Promise<AdminUser[]> {
    return this.listar();
  },

  async crear(admin: Partial<AdminUser & { password?: string; contrasena?: string }>): Promise<AdminUser> {
    try {
      const payload = {
        nombre: admin.nombre?.split(" ")[0] || "Administrador",
        apellido: admin.nombre?.split(" ").slice(1).join(" ") || "Sistema",
        correo: admin.email || `${admin.username || "admin"}@pharma911.com`,
        usuario: admin.username || "admin",
        contrasena: admin.password || admin.contrasena || "Admin123*",
      };
      let response;
      try {
        response = await api.post("/administradores", payload);
      } catch {
        response = await api.post("/admin", {
          username: payload.usuario,
          password: payload.contrasena,
          nombre: `${payload.nombre} ${payload.apellido}`.trim(),
        });
      }
      const d = response.data;
      return {
        id: `ADM-${String(d.id || "001").padStart(3, "0")}`,
        dbId: d.id,
        username: d.usuario || d.username || admin.username,
        nombre: d.nombre ? `${d.nombre} ${d.apellido || ""}`.trim() : (admin.nombre || "Admin"),
        email: d.correo || d.email || admin.email || "",
        rol: admin.rol || "ADMIN_ACCESOS",
        ultimoAcceso: "Recién registrado",
        activo: d.activo ?? true,
      };
    } catch {
      const nuevo: AdminUser = {
        id: `ADM-00${MOCK_ADMINS.length + 1}`,
        username: admin.username || "nuevo.admin",
        nombre: admin.nombre || "Nuevo Administrador",
        email: admin.email || "admin@pharma911.com",
        rol: admin.rol || "ADMIN_ACCESOS",
        ultimoAcceso: "Recién registrado",
        activo: true,
      };
      MOCK_ADMINS.push(nuevo);
      return nuevo;
    }
  },

  async actualizar(id: string | number, admin: Partial<AdminUser & { password?: string; contrasena?: string }>): Promise<AdminUser> {
    try {
      const dbId = typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10) || 1;
      const payload = {
        nombre: admin.nombre?.split(" ")[0] || "Administrador",
        apellido: admin.nombre?.split(" ").slice(1).join(" ") || "Sistema",
        correo: admin.email || `${admin.username || "admin"}@pharma911.com`,
        usuario: admin.username || "admin",
        contrasena: admin.password || admin.contrasena || "Admin123*",
      };
      const response = await api.put(`/administradores/${dbId}`, payload);
      return response.data;
    } catch {
      const idx = MOCK_ADMINS.findIndex(a => a.id === id);
      if (idx !== -1) {
        MOCK_ADMINS[idx] = {
          ...MOCK_ADMINS[idx],
          ...admin,
        };
        return MOCK_ADMINS[idx];
      }
      return {
        ...MOCK_ADMINS[0],
        ...admin,
      } as AdminUser;
    }
  },

  async cambiarEstado(id: string | number, nuevoEstado: boolean): Promise<AdminUser> {
    return this.actualizar(id, { activo: nuevoEstado });
  },

  async eliminar(id: string | number): Promise<void> {
    try {
      const dbId = typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10) || 1;
      await api.delete(`/administradores/${dbId}`);
    } catch {
      await this.cambiarEstado(id, false);
    }
  },
};
