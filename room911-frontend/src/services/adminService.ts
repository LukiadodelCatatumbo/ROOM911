import api from "./api";
import { AdminRole, AdminUser } from "../types";

/**
 * Contrato del backend:
 * - Request  (AdministradorDTO): { nombre, apellido, correo, usuario, contrasena, rol }
 * - Response (AdministradorResponseDTO): { id, nombre, apellido, correo, usuario, rol, activo, ... }
 * `contrasena` es obligatoria al crear; en actualización se envía solo si se desea cambiarla.
 */
interface AdministradorBackend {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  usuario: string;
  rol: AdminRole | string;
  activo?: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

interface AdministradorPayload {
  nombre: string;
  apellido: string;
  correo: string;
  usuario: string;
  contrasena?: string;
  rol: AdminRole | string;
}

const mapAdmin = (d: AdministradorBackend): AdminUser => ({
  id: String(d.id),
  dbId: d.id,
  username: d.usuario,
  nombre: [d.nombre, d.apellido].filter(Boolean).join(" "),
  email: d.correo,
  rol: d.rol as AdminRole,
  ultimoAcceso: d.fechaCreacion
    ? `Creado: ${String(d.fechaCreacion).split("T")[0]}`
    : undefined,
  activo: d.activo ?? true,
});

/** Separa "Nombre Completo" del formulario en nombre + apellido del DTO. */
const dividirNombre = (nombreCompleto: string) => {
  const partes = nombreCompleto.trim().split(/\s+/);
  const nombre = partes[0] || "";
  const apellido = partes.slice(1).join(" ") || nombre;
  return { nombre, apellido };
};

export const adminService = {
  async listar(): Promise<AdminUser[]> {
    const response = await api.get<AdministradorBackend[]>("/administradores");
    return response.data.map(mapAdmin);
  },

  async listarTodos(): Promise<AdminUser[]> {
    return this.listar();
  },

  async crear(
    admin: Partial<AdminUser & { password?: string; contrasena?: string }>
  ): Promise<AdminUser> {
    if (!admin.password && !admin.contrasena) {
      throw new Error("La contraseña es obligatoria para crear un administrador");
    }
    const { nombre, apellido } = dividirNombre(admin.nombre || "");
    const payload: AdministradorPayload = {
      nombre,
      apellido,
      correo: admin.email || "",
      usuario: admin.username || "",
      contrasena: admin.password || admin.contrasena,
      rol: admin.rol || "ADMIN_ACCESOS",
    };
    const response = await api.post<AdministradorBackend>(
      "/administradores",
      payload
    );
    return mapAdmin(response.data);
  },

  async actualizar(
    id: string | number,
    admin: Partial<AdminUser & { password?: string; contrasena?: string }>
  ): Promise<AdminUser> {
    const dbId =
      typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10);
    const { nombre, apellido } = dividirNombre(admin.nombre || "");
    const payload: AdministradorPayload = {
      nombre,
      apellido,
      correo: admin.email || "",
      usuario: admin.username || "",
      rol: admin.rol || "ADMIN_ACCESOS",
    };
    const nuevaContrasena = admin.password || admin.contrasena;
    if (nuevaContrasena) {
      payload.contrasena = nuevaContrasena;
    }
    const response = await api.put<AdministradorBackend>(
      `/administradores/${dbId}`,
      payload
    );
    return mapAdmin(response.data);
  },

  async eliminar(id: string | number): Promise<void> {
    const dbId =
      typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10);
    await api.delete(`/administradores/${dbId}`);
  },
};
