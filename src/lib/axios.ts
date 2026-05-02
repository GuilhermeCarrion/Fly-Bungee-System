import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

/*
 * AxiosInstance - Instancia de configuração fixa personalizada.
 *
 * InternalAxiosRequestConfig - Configuração interna da requisição, garante que o 'header' exista antes de disparar requisição.
 *
 * AxiosRequest - Middleware de saída, envia o token junto com a requisição.
 *
 * AxiosResponse - Middleware de entrada, analisa o que o servidor respondeu antes de entregar o dado para o compente
 * e caso seja "401 - Não te conheço", limpa o sistema e joga para o login.
 */

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
