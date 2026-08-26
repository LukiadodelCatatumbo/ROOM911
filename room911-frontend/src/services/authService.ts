import api, { API_BASE_URL } from "./api";
import axios from "axios";
import { AdminUser } from "../types";

export interface LoginResponse {
  token: string;
  usuario?: string;
  email?: string;
  rol?: string;
  nombre?: string;
}

export const authService = {
  async login(usuario: string, clave: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, {
        username: usuario,
        password: clave,
      });
      const data = response.data;
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
      }
      return data;
    } catch (error) {
      // Demo fallback login if backend is not running
      if (usuario === "admin" && clave === "admin123") {
        const mockResponse: LoginResponse = {
          token: "mock-jwt-token-room911",
          usuario: "admin",
          nombre: "Dr. Jorge Reyes Montoya",
          email: "j.reyes@pharma911.com",
          rol: "SUPER_ADMIN",
        };
        localStorage.setItem("token", mockResponse.token);
        localStorage.setItem("user", JSON.stringify(mockResponse));
        return mockResponse;
      }
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser(): AdminUser | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      const parsed = JSON.parse(userStr);
      return {
        id: parsed.id || "ADM-001",
        username: parsed.usuario || parsed.username || "admin",
        nombre: parsed.nombre || "Dr. Jorge Reyes Montoya",
        email: parsed.email || "j.reyes@pharma911.com",
        rol: (parsed.rol as any) || "SUPER_ADMIN",
        ultimoAcceso: "Hoy, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
    } catch {
      return null;
    }
  },

  getUser(): AdminUser | null {
    return this.getCurrentUser();
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },
};
