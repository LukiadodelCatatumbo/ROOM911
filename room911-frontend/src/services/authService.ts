import api from "./api";
import { AdminRole, AdminUser } from "../types";

/** Contrato exacto de LoginResponseDTO del backend (POST /api/auth/login). */
interface LoginResponseBackend {
  loginCorrecto: boolean;
  mensaje: string;
  token: string;
  usuario: string;
  nombre: string;
  correo: string;
  rol: AdminRole | string;
}

const TOKEN_KEY = "token";
const USER_KEY = "user";

export const authService = {
  async login(usuario: string, clave: string): Promise<LoginResponseBackend> {
    const { data } = await api.post<LoginResponseBackend>("/auth/login", {
      usuario: usuario,
      contrasena: clave,
    });
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(
        USER_KEY,
        JSON.stringify({
          usuario: data.usuario,
          nombre: data.nombre,
          correo: data.correo,
          rol: data.rol,
        })
      );
    }
    return data;
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser(): AdminUser | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      const parsed = JSON.parse(userStr);
      // `usuario` es el nombre actual; `username` mantiene compatibilidad con sesiones previas.
      const usuario = parsed.usuario || parsed.username;
      if (!usuario && !parsed.nombre) return null;
      return {
        id: usuario || "",
        usuario: usuario,
        nombre: parsed.nombre || usuario || "Usuario",
        email: parsed.correo || parsed.email || "",
        rol: parsed.rol,
        ultimoAcceso: parsed.ultimoAcceso,
        activo: true,
      };
    } catch {
      return null;
    }
  },

  getUser(): AdminUser | null {
    return this.getCurrentUser();
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  /** SUPER_ADMIN y ADMIN_ACCESOS pueden escribir en personal/zonas (coincide con los @PreAuthorize del backend). */
  puedeGestionarPersonal(): boolean {
    const rol = this.getUser()?.rol;
    return rol === "SUPER_ADMIN" || rol === "ADMIN_ACCESOS";
  },

  /** SUPER_ADMIN y ADMIN_SISTEMAS gestionan cuentas de administradores. */
  puedeGestionarAdministradores(): boolean {
    const rol = this.getUser()?.rol;
    return rol === "SUPER_ADMIN" || rol === "ADMIN_SISTEMAS";
  },

  esSuperAdmin(): boolean {
    return this.getUser()?.rol === "SUPER_ADMIN";
  },
};
