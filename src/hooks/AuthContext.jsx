import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosAuth';
import { setAccessToken, getAccessToken, clearAccessToken } from './tokenManager';
import apiAuth from '../api/axiosAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await apiAuth.get('/v1/auth/me');
      console.log(res);
      
      setUser(res.data);
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      throw err;
    }
  };

  const tryRestoreSession = async () => {
    try {
      const accessToken = getAccessToken();

      if (accessToken) {
        // Se já tem accessToken, tenta buscar o usuário        
        console.log("fetchUser");
        await fetchUser();
      } else {
        setLoading(true);
        // Tenta obter novo accessToken usando refreshToken via cookie HttpOnly
        console.log("refresh-token");

        const res = await apiAuth.post('/v1/auth/refresh-token');
        const newToken = res.data.accessToken;
        setAccessToken(newToken);
        await fetchUser();

      }
    } catch (err) {
      console.warn("Falha ao restaurar sessão:", err);
      clearAccessToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    tryRestoreSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await apiAuth.post('/v1/auth/login', { email, password });
      setAccessToken(res.data.accessToken);
      await fetchUser();
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiAuth.post('/logout');
    } catch (e) {
      console.warn("Erro ao fazer logout:", e);
    } finally {
      clearAccessToken();
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);