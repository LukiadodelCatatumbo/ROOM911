import api from "./api";

export const obtenerResumen = async () => {
    const response = await api.get("/dashboard/resumen");
    return response.data;
};

export const obtenerAccesosSemana = async () => {
    const response = await api.get("/dashboard/accesos-semana");
    return response.data;
};

export const obtenerDepartamentos = async () => {
    const response = await api.get("/departamentos");
    return response.data;
};