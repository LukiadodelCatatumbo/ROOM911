import axios from "axios";

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:8080/api";

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
      config.headers.set?.("Authorization", `Bearer ${token}`) ||
        ((config.headers as any)["Authorization"] = `Bearer ${token}`);
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
