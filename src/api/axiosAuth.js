import axios from 'axios';
import API_AUTH_URL from "../services/apiAuthUrl";
import { getAccessToken, setAccessToken, clearAccessToken } from '../hooks/tokenManager';

const apiAuth = axios.create({
  baseURL: API_AUTH_URL,
  withCredentials: true,
  headers: {
    'X-System-Name': 'NavSystemCore',
  }
});

// Interceptor para injetar o token no header Authorization
apiAuth.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiAuth.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já está tentando refresh, espera a fila resolver
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await apiAuth.post('/v1/auth/refresh-token');
        const newToken = response.data.accessToken;
        setAccessToken(newToken);
        apiAuth.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return apiAuth(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAccessToken();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiAuth;