import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        // Ensure headers object exists
        config.headers = config.headers || {};
        // Attach Bearer token without template literals to avoid masking
        config.headers.Authorization = 'Bearer ' + token;
    }

    return config;

}, (error) => Promise.reject(error));

export default api;
