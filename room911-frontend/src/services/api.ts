import axios from "axios";

const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};

export const API_BASE_URL = env.VITE_API_URL || "http://localhost:8080/api";

/** API key de la superficie pública /api/acceso (lectores y simulador). */
const ACCESO_API_KEY = env.VITE_ACCESO_API_KEY || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    // El simulador/lector consume /api/acceso sin JWT pero con API key
    if (ACCESO_API_KEY && config.url?.includes("/acceso")) {
      config.headers.set("X-Api-Key", ACCESO_API_KEY);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const esLogin = error.config?.url?.includes("/auth/login");
    const pathname = window.location.pathname;
    const esRutaPublica = pathname === "/login" || pathname === "/simulador" || pathname === "/simulador-acceso" || pathname.startsWith("/credencial/") || pathname.startsWith("/activar-credencial/");
    if (status === 401 && !esLogin && !esRutaPublica) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
