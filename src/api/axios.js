import axios from 'axios';
import API_BASE_URL from "../config";
import { getAccessToken, setAccessToken } from '../hooks/tokenManager';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // para enviar cookies HttpOnly
});

// Interceptor para adicionar token no header Authorization
api.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para refresh token quando der 401
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await api.post('/refresh');
        const newToken = response.data.accessToken;
        setAccessToken(newToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Aqui pode limpar o contexto auth, redirecionar pra login, etc
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

