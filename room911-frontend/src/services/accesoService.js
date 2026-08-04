import api from "./api";

export const validarAcceso = async (documento) => {

    const response = await api.post("/acceso", {

        documento

    });

    return response.data;

};